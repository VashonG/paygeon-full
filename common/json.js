const Agg = (finders, filter, type, pagination) => {
  const query = finders.finders.map(_doc => {
      if(_doc.uuid === filter){
          if(type === 'count'){
              let query = _doc.query.filter((_doc, i) => i !== 1 && i !== 2 ? _doc : null)
              return query
          } else {
              const query = _doc.query.map((_doc, i) => {
                  if(i === 1){
                      return { $skip : parseInt(pagination.offset) }
                  } else if( i === 2){
                      return { $limit : parseInt(pagination.limit) }
                  } else {
                      return _doc
                  }
              })
              return query
          }
      }
  })

  return query.length ? query[0] : []
}

const countByQueryOtherFilter = ({query, itemId, fieldValue, fieldName}) => {
    let normal = query.find(_doc => _doc.fieldName === fieldName)
    if(itemId){
        normal = normal.queryWithItemId
        normal = JSON.parse(JSON.stringify(normal).replace("fieldValue", fieldValue).replace("itemId", itemId))
        return normal
    } else {
        normal = normal.query
        normal = JSON.parse(JSON.stringify(normal).replace("fieldValue", fieldValue))
        return normal
    }
}

module.exports = {
    Agg, 
    countByQueryOtherFilter
};