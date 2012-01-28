template = open("template.html","r").read()
#print template
templateElements = template.split("<!-- # DELIMITER # -->")
#print templateElements


scriptFile = open("math.js").read()


################################################################################
############################## FIX OR ADD COMMENTS #############################
################################################################################
fullComments = ""
createTemplates = scriptFile.split("/*")
if createTemplates[0] == "":
  createTemplates.pop(0)
for i in range(0,len(createTemplates)):
  createTemplates[i] = "/*"+createTemplates[i]
  numberOfFunctions = createTemplates[i].split("function ")
  if len(numberOfFunctions) == 1:
    fullComments += createTemplates[i]
    continue;
  else:
    fullComments += numberOfFunctions[0] + "function " + numberOfFunctions[1]
    numberOfFunctions.pop(0)
    numberOfFunctions.pop(1)
    for j in numberOfFunctions:
      functionContext = "function " + j
      j = j[0:j.find(')')].split('(')
      removeUnderscore = j[0].split('_',1)
      print removeUnderscore[0]
      
      commentName = removeUnderscore[0].upper()+' - '+removeUnderscore[1].upper()
      
      half = (74-len(commentName))/2;  
      
      fullComments += "/*"
      for k in range(0,half):
        fullComments += '*'
      if (len(commentName)%2 == 1):
        fullComments += '*'
      fullComments += ' ' + commentName + ' '
      for k in range(0,half):
        fullComments += '*'
      
      fullComments += "*\\\n| Alternate Arguments:\n| Example:\n| Summary:\n|\n\\******************************************************************************/\n" + functionContext 
      
outputFile = open("fullComments.js","w")
outputFile.write(fullComments);
##
  



functions = scriptFile.split("function ")

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
