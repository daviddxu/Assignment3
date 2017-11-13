/*
Interacting with external services

Simple example of node.js app serving contents based 
on an available internet service. 
In this case api.openweathermap.org

***IMPORTANT NOTE***
As of 2015 openweather requires that you provide an APPID
with your HTTP requests. You can get on by creating a
free account at: http://openweathermap.org/appid

To Test: Use browser to view http://localhost:3000/
*/

let http = require('http')
let url = require('url')
let qstring = require('querystring')
var ingredientNames = ''

const PORT = process.env.PORT || 3000
//Please register for your own key replace this with your own.
const API_KEY = '31bc2311421abe09f5e1584ed093a292'

function sendResponse(recipeData, res){
  var page = '<html><head><title>API Example</title></head>' +
    '<body>' +
    '<form method="post">' +
    'Ingredients: <input name="ingredients"><br>' +
    '<input type="submit" value="Get Recipes">' +
    '</form>'
  if(recipeData){
	  
	 var ingredient = recipeData
	 console.log(recipeData);
	// console.log("city: ", city);
  page += '<h1>Recipes for ' + ingredientNames + '</h1>'  + '<p>' + recipeData +'</p>'  }
  page += '</body></html>'    
  res.end(page);
}

function parseData(recipeResponse, res) {
  let recipeData = ''
  recipeResponse.on('data', function (chunk) {
    recipeData += chunk
  })
  recipeResponse.on('end', function () {
    sendResponse(recipeData, res)
  })
}

function getRecipes(ingredients, res){

//New as of 2015: you need to provide an appid with your request.
//Many API services now require that clients register for an app id.

//Make an HTTP GET request to the openweathermap API
  const options = {
    host: 'www.food2fork.com',
    path: `/api/search?q=${ingredients}&key=${API_KEY}`

  }
  http.request(options, function(apiResponse){
    parseData(apiResponse, res)
  }).end()
}

http.createServer(function (req, res) {
  let requestURL = req.url
  let query = url.parse(requestURL).query //GET method query parameters if any
  let method = req.method
  console.log(`${method}: ${requestURL}`)
  console.log(`query: ${query}`) //GET method query parameters if any
  
  if (req.method == "POST"){
    let reqData = ''
    req.on('data', function (chunk) {
      reqData += chunk
    })
    req.on('end', function() {
	  console.log(reqData);
      var queryParams = qstring.parse(reqData)
	  console.log("queryParams: ", queryParams)
	  console.log("queryParams.ingredients: ", queryParams.ingredients);
	  ingredientNames = queryParams.ingredients;
      getRecipes(queryParams.ingredients, res)
    })
  } else if(req.method == "GET"){	//parse name
  
	
	  var queryParams =  qstring.parse(query)
	//  console.log("queryParams (GET): ", queryParams)
	
	ingredientNames = queryParams.ingredients;
	   
	  getRecipes(queryParams.ingredients, res)
  }else{
    sendResponse(null, res)
  }
}).listen(PORT, (error) => {
  if (error)
    return console.log(error)
  console.log(`Server is listening on PORT ${PORT} CNTL-C to quit`)
})
