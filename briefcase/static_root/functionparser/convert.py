template = open("template.html","r").read()
#print template
templateElements = template.split("<!-- # DELIMITER # -->")
#print templateElements
functions = open("math.js").read().split("function ")
functions.pop(0)
for function in functions:
  functionIndex = functions.index(function) 
  function = function[0:function.find(')')].split('(')
  removeUnderscore = function[0].split('_',1)
  function[0] = removeUnderscore[0]+'.'+removeUnderscore[1]
  functions[functionIndex] = function

outputData = templateElements[0]
for function in functions:
  outputData += templateElements[1]
  outputData += function[0] + templateElements[2]
  outputData += function[1] + templateElements[3]
  outputData += "No description" + templateElements[4]
outputData += templateElements[5]

outputFile = open("docs.html","w")
outputFile.write(outputData);

