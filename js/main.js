function img_uploader_btn() {
    console.log("click img_uploader");
    let img_input = document.getElementById("img_uploader");
    img_input.click();
}

var source = new Image();
var source_info = new PhotoInfo();
var preview = document.getElementById("preview");
var origin = document.getElementById("origin");

function render_btn() {
    getPhotoInfoFromHtml(source_info);
    if(source.src) {
        drawCanvas(preview, source, source_info);
    } else {
        drawCanvas(preview, null, source_info);
    }
    console.log(source_info);
}

function download_btn() {
    // render
    if(!source.src) {
        drawCanvas(origin, null, source_info);
    } else {
        setCanvasSize(origin, source_info.width, source_info.ratio);
        drawCanvas(origin, source, source_info);
    }
    Canvas2Image.saveAsJPEG(origin, origin.width, origin.height, source_info.name);
}

function img_uploader() {
    let img_uploader = document.getElementById("img_uploader");
    let file = img_uploader.files[0];
    if(img_uploader.value == '') {
        return;
    }

    let btn = document.getElementById("img_btn");
    btn.disabled = true;
    document.getElementById("render_btn").disabled = true;
    let btn_ing = document.getElementById("img_btn_ing");
    btn_ing.hidden = false;
    btn_ing.style.display = "inline-block";
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(result){
        source_info.name = file.name.split('.')[0];
        let img = new Image();
        img.src = result.target.result;
        img.onload = function (e) { 
            btn.disabled = false;
            document.getElementById("render_btn").disabled = false;
            btn_ing.style.display = "none";
            parseImage(img, source_info);
            updateHtmlPhotoInfo(source_info);
            console.log(source_info);
            setCanvasSize(preview, preview.width, source_info.ratio);
            drawCanvas(preview, img, source_info);
            source = img;
        }
    }
}