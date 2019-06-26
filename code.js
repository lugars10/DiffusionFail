class Plane
{
    constructor(width, height, size, colors)
    {
        this.width = width;
        this.height = height;
        this.size = size;
        this.colors = colors;
        this.pixels = [];

        for(let h = 0; h!=height; h++)
        {
            for(let w = 0; w!=width; w++)
            {
                let pixel = document.createElement("div");
                pixel.style.height = size + "px";
                pixel.style.width = size + "px";
                pixel.style.position = "absolute";
                pixel.style.left = (w*size) + "px";
                pixel.style.top = (h*size) + "px";
                pixel.style.backgroundColor = colors[h%colors.length];
                pixel.id = this._2to1(w,h);
                this.pixels[this._2to1(w,h)] = pixel;
                document.body.appendChild(pixel);
                
            }

        }
    }

    _2to1(x,y) //Converts 2d list coordinates into 1d list single number.
    {
        return (this.width * y) + x;
    }

    _1to2(n) //Converst 1d list single number to 2d coordinates
    {
        let coords = {x:null,y:null};
        coords.y = Math.ceil( (n+1)/this.width )-1;
        coords.x = -(coords.y * this.width) + n;
        return coords;
         
    }
    getColorAt(x,y, stringMode = true)//Incomplete function
    {
        let pixel;
        if(y!=undefined){ pixel = this.pixels[this._2to1(x,y)]; }
        else{ pixel = this.pixels[x]; }

        if(stringMode)
        {
            return window.getComputedStyle(pixel, null).getPropertyValue("background-color");
        }
        else
        {
            let code = {r:null, g:null, b:null};
            let color = window.getComputedStyle(pixel, null).getPropertyValue("background-color");
            let colorsArr;
            color = color.replace("rgb(", "");
            color = color.replace(")", "");
            color = color.replace(/ /g, "");
            colorsArr = color.split(",");
            code.r = parseInt(colorsArr[0]);
            code.g = parseInt(colorsArr[1]);
            code.b = parseInt(colorsArr[2]);
            return code;
        }
    }

    //If stringMode is false, RGB color is returned as an object, otherwise, as a string
    setColorAt(x,y,color)
    {
        if(y == undefined)
        {
            let coords = this._1to2(x);
            y = coords.y;
            x = coords.x;
        }

        let colors = ["blue", "red", "pink", "orange", "yellow", "green", "purple"];
        let codes = ["66, 134, 224", "244, 66, 66", "255, 155, 211", "239, 122, 59", "255, 218, 71",
        "93, 226, 70", "101, 70, 226"];

        let newColor = "rgb(" + color + ")";

        for(let i = 0; i!= colors.length; i++)
        {
            if(color == colors[i]){newColor = "rgb("+codes[i]+")";}
        }

        let pixel = this.pixels[this._2to1(x,y)];
        pixel.style.backgroundColor = newColor;
    }
    getPixelAt(x,y)
    {
        let pixel = this.pixels[this._2to1(x,y)];
        return pixel;
    }

    getNearPixels(_x,_y)
    {
        let pixels = [];
        let prePixels = [];
        let pUp = {x:_x, y:_y-1};
        let pDown = {x:_x, y:_y+1};
        let pRight = {x:_x+1, y:_y};
        let pLeft = {x:_x-1, y:_y};
        prePixels = [pUp, pDown, pRight, pLeft];

        pixels.push(this.getPixelAt(_x, _y));
        for(let i = 0; i != prePixels.length; i++)
        {
            let p = prePixels[i];
            if(p.x >= 0 && p.x <= (this.width-1) && p.y >= 0 && p.y <= (this.height-1))
            {
                pixels.push(this.getPixelAt(p.x, p.y));
            }
        }
        return pixels;
    }

    getPixels()
    {
        return this.pixels;
    }

    diffuse(n)
    {
        let coords = this._1to2(n);
        let pixels = this.getNearPixels(coords.x, coords.y);
        let meanR = 0;
        let meanG = 0;
        let meanB = 0;
        
        for(let i = 0; i!= pixels.length; i++)
        {
            let pixelColor = this.getColorAt(pixels[i].id, undefined, false);
            meanR += pixelColor.r;
            meanG += pixelColor.g;
            meanB += pixelColor.b;
        }
        meanR /= pixels.length;
        meanG /= pixels.length;
        meanB /= pixels.length;
        return [meanR, meanG, meanB, pixels];
    }
}
let plane = new Plane(30,50,10,["rgb(66, 134, 224"]);
plane.setColorAt(15, 25, "red");
plane.setColorAt(15, 24, "orange");
plane.setColorAt(14, 26, "green");


function spread()
{
    let pix_col = []; //Array init based on plane pixels. 
    let dif;
    for(let i = 0; i!= plane.pixels.length; i++)
    {
        let rgb = {r:0, g:0, b:0};
        pix_col.push(rgb);
    }
    
    for(let i = 0; i!= plane.pixels.length; i++)
    {
        dif = plane.diffuse(i);
        for(let j = 0; j!= dif[3].length; j++) 
        {
            let index = dif[3][j].id;
            let pixelColor = plane.getColorAt(index, undefined, false);
            pix_col[index].r += dif[0] - pixelColor.r;
            pix_col[index].g += dif[1] - pixelColor.g;
            pix_col[index].b += dif[2] - pixelColor.b;
        }
    }
    for(let i = 0; i!= plane.pixels.length; i++)
    {
        let newColor = plane.getColorAt(i, undefined, false);
        newColor.r += pix_col[i].r;
        newColor.g += pix_col[i].g;
        newColor.b += pix_col[i].b;
        plane.setColorAt(i, undefined, newColor.r + ", " + newColor.g + ", " + newColor.b);
    }

}

for(let t = 26; t!= 0; t--)
{
    spread();
}
//window.setInterval(



/*
-Heat only flows from hotter to colder.
-Heat is tranferred with a constant flow (heat per unit time) "q".
-
*/