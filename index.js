const functions = require('@google-cloud/functions-framework');
const cohere = require("cohere-ai");
const domains = process.env.CORS_DOMAINS.split(',');
const cohereModel = process.env.COHERE_MODEL || 'embed-multilingual-v2.0';

cohere.init(process.env.COHERE_API_KEY);

function getAllowOrigin(requestOrigin) {
  if(!requestOrigin) {
    return domains[0]
  }
  if(requestOrigin.indexOf('http://localhost') === 0 || domains.indexOf(requestOrigin) >= 0) {
    return requestOrigin;
  }
  return domains[0];
}

functions.http('embed', async (req, res) => {
  const requestOrigin = req.get('origin');
  res.set('Access-Control-Allow-Origin', getAllowOrigin(requestOrigin));
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.status(204).send('');
    return;
  }
  const primer = req.body.primer ? `${req.body.primer} ` : ''
  const sentences = (req.body.sentences || []).filter(s => !!s).map(s => `${primer}${s}`);
  res.setHeader('content-type', 'application/json')
  if(sentences.length > 0) {
    const embeddingResponse = await cohere.embed({
      texts: sentences,
      model: cohereModel,
      truncate: "END"
    })
    if(embeddingResponse.statusCode === 200) {
      const embeddings = embeddingResponse.body.embeddings;
      res.send({success: true, embeddings})
    } else {
      console.error(embeddingResponse.statusCode)
      console.error(embeddingResponse.body)
      res.status(500).send({success: false, reason: 'embedding.error'})
    }
  } else {
    res.status(400).send({success: false, reason: 'field.sentences.mandatory'})
  }
});
