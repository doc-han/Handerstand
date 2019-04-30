var keywords = [];//holds the keywords
var nkeywords = [];//holds the new keywords

function add(num){
    var reps = ["h","p","cpp","js","markup","java"];
    var placeholders = ["Heading","Paragraph","C++","JavaScript","MarkUp","Java"];
    var a = document.getElementById('inner');
    var n = num>1?document.createElement("textarea"):document.createElement("div");
    n.setAttribute("contenteditable", true);
    n.className = "post_data"+ (num>1?" code":"");

    n.setAttribute("ref-data",reps[num]);
    n.innerText = placeholders[num];
    a.appendChild(n);
}

function submit(loc){
    var html = "";
    var content = [];
    var title = document.getElementById("post_title");
    var desc = document.getElementById("post_description");
    var a = document.getElementsByClassName("post_data");
    for(i=0;i<a.length;i++){
        var ref = a[i].getAttribute("ref-data");
        if(ref == "p"){
            html += "<p>"+ a[i].innerHTML +"</p>";
        }else if(ref == "h"){
            html += "<h>"+ a[i].innerHTML +"</h2>";
            content.push(id);
        }else if(ref == "cpp"){
            html += "<pre><code class='language-cpp'>"+ a[i].value+ "</code></pre>";
        }else if(ref == "js"){
            html += "<pre><code class='language-js'>"+ a[i].value+ "</code></pre>";
        }else if(ref == "markup"){
            var vl = a[i].value;
            vl = vl.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
            vl = vl.replace(/\"/g,"&quot;");
            html += "<pre><code class='language-markup'>"+ vl + "</code></pre>";
        }else if(ref == "java"){
            html += "<pre><code class='language-java'>"+ a[i].value+ "</code></pre>";
        }
    }
    var data = {
        title: title.innerText,
        description: desc.innerText,
        keywords: keywords,
        nkeywords: nkeywords,
        body: html,
        active: loc=="internet"?true:false
    }

    $.ajax({
        url: 'new-post',
        method: 'POST',
        data: data,
        success: function(res){
            if(res=="OK"){
                document.location = '/admin/home';
            }else{
                alert("Error adding post. Try Again!");
            }
        }
    })
}

function enter(e){
    var a = document.getElementById("available");
    if(e.code == "Enter"){
        var i = document.getElementById("keyword_data");
        var info = i.value;
        var code = i.value.split(" ").join("-");
        var elem = document.createElement("span");
        elem.innerText = info;
        elem.setAttribute("ref-data",code);
        nkeywords.push(code);
        a.appendChild(elem);
        i.value = "";
    }
}

document.getElementById("words").addEventListener("click",function(e){
    var tag = e.target;
    if(tag.tagName=="SPAN"){
    var elem = document.createElement("span");
    elem.innerText = tag.innerText;
    var code = tag.getAttribute('ref-data');
    keywords.splice(keywords.indexOf(code),1);
    
    elem.setAttribute("ref-data",code);
    document.getElementById("available").appendChild(elem);
    tag.parentNode.removeChild(tag);
    }
});

document.getElementById("available").addEventListener("click",function(e){
    var tag = e.target;
    if(tag.tagName=="SPAN"){
    var elem = document.createElement("span");
    elem.innerText = tag.innerText;
    var code = tag.getAttribute("ref-data");
    keywords.push(code);
    elem.setAttribute("ref-data",code);
    document.getElementById("words").appendChild(elem);
    tag.parentNode.removeChild(tag);
    }
    
    
})