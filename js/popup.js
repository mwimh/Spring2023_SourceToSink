window.addEventListener("load", function(){
    this.setTimeout(
        function open(event){
            document.querySelector(".popup").getElementsByClassName.display = "block";
        },
        1000
    )
});

document.querySelector("#close").addEventListener("click", function(){
    document.querySelector(".popup").display = "none";
});