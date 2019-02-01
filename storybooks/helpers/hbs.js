const removeMd = require('remove-markdown');
const moment = require('moment')

module.exports = {
  truncate: function(str, len){
    if(str.length > len && str.length > 0){
      let new_str = str + " "
      new_str = str.substring(0, len)
      new_str = str.substring(0, new_str.lastIndexOf(" "))
      new_str = (new_str.length > 0) ? new_str : str.substring(0,len)
      return new_str + "..."
    }
    return str
  },
  stripTags: function(input){
    return removeMd(input)
  },
  formatDate: function(date, format){
    return moment(date).format(format)
  },
  select: function(selected, options){
    return options.fn(this).replace(new RegExp(' value=\"'+selected+'\"'), '$&selected="selected"').replace(new RegExp('>'+selected+'</option>'),'selected="selected"$&')
  },
  editIcon: function(storyUser, loggedUser, storyId, floating = true){
    if (storyUser == loggedUser){
      if (floating){
        return `<a href="/storybooks/stories/edit/${storyId}" class="btn-floating halfway-fab red"><i class="material-icons">edit</i></a>`
      }
      else{
        return `<a href="/storybooks/stories/edit/${storyId}"><i class="material-icons">edit</i></a>`
      }
    }
    else{
      return
    }
  }
}