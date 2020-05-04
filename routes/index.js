const mod=require('./modules').module;
const router = mod.express.Router();

router.get('/AuthPage',function(req,res)
{
let state=mod.crypto.randomBytes(16).toString('hex');
res.cookie('XSRF-TOKEN',state);
res.send({authUrl:"https://github.com/login/oauth/authorize?client_id="+mod.config.CLIENT_ID+'&redirect_uri='+mod.config.REDIRECT_URI+'&scope=read:user&allow_signup='+true+'&state='+state});
})

router.post('/getAccessToken',function(req,res)
{
let state=req.headers["x-xsrf-token"];
mod.axios({
url:'https://github.com/login/oauth/access_token?client_id='+mod.config.CLIENT_ID+'&client_secret='+mod.config.CLIENT_SECRET+'&code='+req.body.code+'&redirect_uri='+mod.config.REDIRECT_URI+'&state='+state,
method:'POST',
headers:{'Accept':'application/json'}
})
.then(function(resp)
{
    res.send(resp.data);
})
.catch(function(err)
{
    console.log(err);
    res.send(err);
})

})

router.get('/getUserDetails',function(req,res)
{
mod.axios({
url:'https://api.github.com/user',
method:'GET',
headers:{'Authorization':req.headers["authorization"]}
})
.then(function(resp)
{
    res.send(resp.data);
})
.catch(function(err)
{
    res.send(err);
})
})

module.exports = router;
