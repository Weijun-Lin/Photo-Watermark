// 渲染相关代码

// 
class PhotoInfo {
    constructor() {
        this.name = "photo";
        this.make = "NIKON";
        this.module = "Nikon D7000";
        this.time = (new Date()).toLocaleString('chinese', {
            hour12: false
        });
        this.focal_length = 50;
        this.f = 2.8;
        this.shutter = "1/200";
        this.iso = 100;
        this.width = 0;
        this.height = 0;
        this.ratio = 2/3;
        this.logo = "nikon";
    }
}

function parseImage(source, photo_info) {
    // get image nnatual size and set height width ratio
    photo_info.height = source.naturalHeight;
    photo_info.width = source.naturalWidth;
    photo_info.ratio = photo_info.height / photo_info.width;
    // get source image info
    EXIF.getData(source, function () {
        let exif_info = EXIF.getAllTags(source);
        photo_info.make = exif_info.Make;
        // set logo through the make
        if (photo_info.make.toLowerCase().includes("nikon")) {
            // photo_info.make = "NIKON";
            photo_info.logo = "nikon";
        }
        photo_info.module = exif_info.Model;
        photo_info.focal_length = exif_info.FocalLength.valueOf();
        photo_info.f = exif_info.FNumber.valueOf();
        // get the shutter
        if (exif_info.ExposureTime.denominator > exif_info.ExposureTime.numerator) {
            photo_info.shutter = "1/" + exif_info.ExposureTime.denominator / exif_info.ExposureTime.numerator;
        } else {
            photo_info.shutter = exif_info.ExposureTime.numerator / exif_info.ExposureTime.denominator + "/1";
        }
        photo_info.iso = exif_info.ISOSpeedRatings;
        photo_info.time = exif_info.DateTimeOriginal;
        console.log(exif_info);
    });
}

function drawCanvas(canvas, source_img, photo_info) {
    if (canvas.getContext) {
        console.log(canvas.width)
        console.log(canvas.getAttribute("width"))
        let ctx = canvas.getContext('2d');
        let canvas_w = canvas.width;
        let canvas_h = canvas.height;

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, canvas_w, canvas_h);
        
        let img_width = canvas_w;
        let img_height = photo_info.ratio * canvas_w;

        ctx.fillStyle = "rgb(0, 0, 0)";
        let mid_line = (img_height + canvas_h) / 2;
        let white_height = canvas_h - img_height;
        

        if(source_img != null) {
            ctx.drawImage(source_img, 0, 0, source_img.width, source_img.height, 0, 0, img_width, img_height);
        } else {
            ctx.font = "normal bold " + white_height + "px" + " Georgia";
            let text = "Your Image";
            let text_width = ctx.measureText(text).width;
            ctx.textBaseline = "bottom";
            ctx.fillText(text, (img_width-text_width)/2, img_height/2 + white_height/2);
            
            ctx.fillStyle = "rgb(10, 10, 10)";
            ctx.lineWidth = 1;
            ctx.lineCap = "butt";
            ctx.beginPath();
            ctx.moveTo(0, img_height);
            ctx.lineTo(canvas_w, img_height);
            ctx.stroke();
        }

        let font_height_make = parseInt(white_height * 0.4);
        ctx.font = "normal bold " + font_height_make + "px" + " Georgia";
        ctx.textBaseline = "bottom";
        ctx.fillText(photo_info.make, 10, img_height + white_height * 0.6);
        font_height_make = parseInt(white_height * 0.2);
        ctx.font = "normal " + font_height_make + "px" + " courier";
        ctx.fillText(photo_info.module, 10, img_height + white_height * 0.8);

        let font_height_info = parseInt(white_height / 5);
        ctx.font = "normal bold " + font_height_info + "px courier";
        ctx.textBaseline = "bottom";
        let info_text = `${photo_info.focal_length}mm f${photo_info.f} ${photo_info.shutter} ISO ${photo_info.iso}`;
        let text_width = Math.max(ctx.measureText(info_text).width, ctx.measureText(photo_info.time).width);
        let info_x = 0.99 * canvas_w - text_width;
        ctx.fillText(info_text, info_x, mid_line - font_height_info / 3);

        ctx.fillStyle = "rgb(100, 100, 100)";
        ctx.font = "normal italic" + font_height_info + "px courier";
        ctx.fillText(photo_info.time, info_x, mid_line + (1.333) * font_height_info);

        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = font_height_info/10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(info_x, mid_line);
        ctx.lineTo(0.99 * canvas_w, mid_line);
        ctx.stroke();

        // draw logo
        let logo = document.getElementById(photo_info.logo);
        let logo_height = white_height * 0.8;
        let logo_width = logo_height * logo.naturalWidth / logo.naturalHeight;
        let logo_x = 0.98*canvas_w - text_width - logo_width;
        ctx.drawImage(logo, 0, 0, logo.naturalWidth, logo.naturalHeight, logo_x, mid_line - logo_height / 2, logo_width, logo_height);

    } else {
        alert("do not support canvas 2d in your browser");
    }
}

// set canvas size

function setCanvasSize(canvas, width, ratio) {
    // 水印占比 1/water_mark_scale
    let water_mark_scale = 7;
    canvas.setAttribute("width", width + "px");
    canvas.setAttribute("height", (ratio * width + ratio * width / water_mark_scale) + "px");
    console.log(canvas.width)
    console.log(canvas.offsetWidth)
}

function updateHtmlPhotoInfo(photo_info) {
    document.getElementById("make").value = photo_info.make;
    document.getElementById("module").value = photo_info.module;
    document.getElementById("focal_length").value = photo_info.focal_length;
    document.getElementById("F").value = photo_info.f;
    document.getElementById("shutter").value = photo_info.shutter;
    document.getElementById("iso").value = photo_info.iso;
    document.getElementById("time").value = photo_info.time;
}

function getPhotoInfoFromHtml(photo_info) {
    photo_info.make = document.getElementById("make").value;
    photo_info.module = document.getElementById("module").value;
    photo_info.focal_length = document.getElementById("focal_length").value
    photo_info.f = document.getElementById("F").value;
    photo_info.shutter = document.getElementById("shutter").value;
    photo_info.iso = document.getElementById("iso").value;
    photo_info.time = document.getElementById("time").value;
}

function render() {
    // 设置预览 canvas 大小
    let default_info = new PhotoInfo();
    let dpr = window.devicePixelRatio;
    console.log("dpr = ", dpr)
    let preview = document.getElementById("preview");
    let width = dpr * preview.offsetWidth;
    setCanvasSize(preview, width, default_info.ratio);
    setCanvasSize(origin, width, default_info.ratio);
    console.log(origin.width);
    updateHtmlPhotoInfo(default_info);
    // render
    drawCanvas(preview, null, default_info);
}