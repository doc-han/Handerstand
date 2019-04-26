var words = ['a','and','the','an','it','is','with','can','of','why','not','in'];
module.exports = function(title){
    //removing starting,ending and double spaces
    title = title.trim().toLowerCase();
    title = title.replace(/ +/g," ");
    //removing words not useful to seo
    title = title.split(" ");
    words.forEach(w=>{
        while(title.indexOf(w)>=0){
            title.splice(title.indexOf(w),1);    
        }
    });
    title = title.join("-");
    //removing punctuations from url
    return title;
}

