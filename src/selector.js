// Podemos usar el siguiente formato de comentario para definir
// el comportamiento de la Función.
/**
 * @description: Recorre el árbol del DOM y recolecta elementos que coincidan en un Array (resulSet).
 * @param {function} matcher: La Función generada por `matchFunctionMaker`.
 * @param {object} startElement: Nodo del que parte la búsqueda.
 * @returns {array}: Nodos encontrados.
 */
const traverseDomAndCollectElements = function(matcher,startElement = document.body){
  let resultSet = [];

  // Usá `matcher` para identificar el nodo correcto
  // Escribí tu código acá
  if(matcher(startElement)){
    resultSet.push(startElement)
  }
  for(let i = 0; i < startElement.children.length; i++){
    let x = traverseDomAndCollectElements(matcher, startElement.children[i])
    
    resultSet = resultSet.concat(x)
      
    
  } 
  
  return resultSet;
};

/**
 * @description: Detecta y devuelve el tipo de selector
 * @param {string} selector: Representa el selector a evaluar.
 * @returns {string}: Devuelve uno de estos tipos: id, class, tag.class, tag
 */
const selectorTypeMatcher = function (selector) {
  // Escribí tu código acá
  if(selector[0] === '#'){
    return 'id'
  }
  if(selector[0] === '.'){
    return 'class'
  }
  if(selector.includes('.')){
    return 'tag.class'
  }
  if(selector.includes(" > ")){
    return 'direct-child'
  }
  if(selector.includes(" ")){
    return "child"
  }
  return "tag"
};

/**
 * @description: Genera una Función comparadora en base a un selector dado.
 * @param {string} selector: Representa el selector a evaluar.
 * @returns {function}: Toma un elemento como un parámetro y devuelve `true`/`false` si el elemento coincide, o no, con el selector.
 */
const matchFunctionMaker = function (selector) {
  const selectorType = selectorTypeMatcher(selector);
  let matcher;
  if(selectorType === "id") {
    // define matcher para id
    matcher = function(elemento){
      if(selector.slice(1) === elemento.id){
        return true
      }else{
        return false
      }
    }
  
  }else if(selectorType === "class") {
     // define matcher para class
     matcher = function (elemento){
      let arr = elemento.className.split(' ');
      if(arr.includes(selector.slice(1)) == true) return true;
      else {
        return false;
      }
    }
  
  }else if (selectorType === "tag.class") {
    // define matcher para tag.class
    matcher = function(elemento){
      let arrClass = elemento.className.split(' ')
      let selectTag = selector.split('.')

      if(elemento.tagName.toLowerCase() == selectTag[0]){
        if(arrClass.includes(selectTag[1])== true) return true
      }else{
        return false
      }
      return false
    }
  
  }else if(selectorType === "tag") {
    // define matcher para tag
    matcher = function(elemento){
      if(selector === elemento.tagName.toLowerCase()) return true
      else{
        return false
      }
    }
  }else if(selectorType === "direct-child"){
    
    const[parent, child] = selector.split(" > ")
    const parentMatcher = matchFunctionMaker(parent)
    const childMatcher = matchFunctionMaker(child)
    matcher = function(elemento){
      return childMatcher(elemento) && parentMatcher(elemento.parentNode)
    }
    
  }else if(selectorType === "child"){
    const [parent, child] = selector.split(' ')
    const parentMatcher = matchFunctionMaker(parent)
    const childMatcher = matchFunctionMaker(child)
    matcher = function(elemento){
      if(childMatcher(elemento)){
        let currentParent = elemento.parentNode
        while(currentParent){
          if(parentMatcher(currentParent)){
            return true
          }else{
            currentParent = currentParent.parentNode
          }
        }
        return false
      }
    }
  }


  return matcher;
};

/**
 * @description: Busca en el DOM tree los nodos que coincidan con el selector dado.
 * @param {string} selector: Representa el selector a evaluar.
 * @returns {array}: Nodos encontrados.
 */
const querySelector = function (selector) {
  const selectorMatchFunc = matchFunctionMaker(selector);
  const elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
