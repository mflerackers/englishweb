class Material {
    colorAt(position, normal, light) {
        return [1,1,1,1];
    }
};

class Phong extends Material {
    constructor({ka=0,ca=[1,1,1,1],kd=1,cd=[1,1,1,1],ks=1,cs=[1,1,1,1], n=4} = {}) {
        super();
        this.ka = ka;
        this.ca = ca;
        this.kd = kd;
        this.cd = cd;
        this.ks = ks;
        this.cs = cs;
        this.n = n;
    }
    
    colorAt(position, normal, light) {
        let diffuse = this.kd * Math.min(Math.max(vec3.dot(normal, light), 0), 1);
        let eye = [0,0,1];
        let reflection = vec3.normalize(vec3.reflect(light, normal));
        let specular = this.ks * Math.pow(Math.max(vec3.dot(eye, reflection),0), this.n);
        let r = Math.min(1, this.ka * this.ca[0] + this.cd[0] * diffuse + this.cs[0] * specular);
        let g = Math.min(1, this.ka * this.ca[1] + this.cd[1] * diffuse + this.cs[1] * specular);
        let b = Math.min(1, this.ka * this.ca[2] + this.cd[2] * diffuse + this.cs[2] * specular);
        return [r,g,b,1];
    }
};

class Blinn extends Material {
    constructor({ka=0,ca=[1,1,1,1],kd=1,cd=[1,1,1,1],ks=1,cs=[1,1,1,1], n=4} = {}) {
        super();
        this.ka = ka;
        this.ca = ca;
        this.kd = kd;
        this.cd = cd;
        this.ks = ks;
        this.cs = cs;
        this.n = n;
        console.log(this);
    }
    
    colorAt(position, normal, light) {
        let diffuse = this.kd * Math.max(Math.min(vec3.dot(normal, light), 0), 1);
        let eye = [0,0,1];
        let halfvector = vec3.normalize(vec3.add(light, eye));
        let specular = this.ks * Math.pow(Math.max(vec3.dot(normal, halfvector),0), this.n);
        let r = Math.min(1, this.ka * this.ca[0] + this.cd[0] * diffuse + this.cs[0] * specular);
        let g = Math.min(1, this.ka * this.ca[1] + this.cd[1] * diffuse + this.cs[1] * specular);
        let b = Math.min(1, this.ka * this.ca[2] + this.cd[2] * diffuse + this.cs[2] * specular);
        return [r,g,b,1];
    }
};

class ConditionalMaterial {
    constructor(materials, expression) {
        this.materials = materials;
        this.expression = expression;
    }
    
    colorAt(position, normal, light) {
        return this.materials[this.expression(position, normal)].colorAt(position, normal, light);
    }
};

class Sphere {
    constructor(cx, cy, r) {
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }
    
    xyzAt(x, y) {
        let dx = x - this.cx;
        let dy = y - this.cy;
        let dx2 = dx*dx;
        let dy2 = dy*dy;
        let r2 = this.r*this.r;
        if (dx2 + dy2 <= r2) {
            let l2 = dx2 + dy2;
            return [dx, dy, Math.sqrt(r2-l2)];
        }
        else {
            return null;
        }
    }
    
    normalAt(p) {
        return vec3.normalize(p);
    }
    
    colorAt(_x, _y, l, material) {
        let p = this.xyzAt(_x, _y);
        if (!p) return null;
        let n = this.normalAt(p);
        let [r,g,b,_] = material.colorAt(p, n, l);
        let d = this.r - Math.sqrt(p[0]*p[0]+p[1]*p[1]);
        let a = d > 1 ? 1 : d;
        return [r,g,b,a];
    }
    
    render(img, material, light) {
        let halfsize = this.r + 2;
        let size = halfsize * 2;
        let xmin = this.cx - halfsize;
        let ymin = this.cy - halfsize;
        let xmax = this.cx + halfsize;
        let ymax = this.cy + halfsize;
        let index = (ymin * img.width + xmin) * 4;
        console.log(xmin, xmin, ymin, ymax);
        for (let j = ymin; j < ymax; j++) {
            for (let i = xmin; i < xmax; i++) {
                let c = this.colorAt(i, j, light, material);
                if (!c) {
                    index += 4;
                    continue;
                }
                let [r,g,b,a] = c;
                img.data[index++] = r*255;
                img.data[index++] = g*255;
                img.data[index++] = b*255;
                img.data[index++] = a*255;
            }
            index += 4 * (img.width - size);
        }
    }
}

class vec3 {
    
    static fromTo(from, to) {
        return [to[0]-from[0],to[1]-from[1],to[2]-from[2]];
    }
    
    static negate(v) {
        return [-v[0],-v[1],-v[2]];
    }
    
    static normalize(v) {
        let l = Math.sqrt(vec3.dot(v,v));
        return [v[0]/l,v[1]/l,v[2]/l];
    }
    
    static dot(a, b) {
        return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    }
    
    static add(a, b) {
        return [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
    }
    
    static sub(a, b) {
        return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];
    }
    
    static mul(v, s) {
        return [v[0]*s,v[1]*s,v[2]*s];
    }
    
    static reflect(a, b) {
        return vec3.sub(vec3.mul(b, 2 * vec3.dot(b, a)), a);
    }
}

function renderSphere(img, x, y, r, c, l) {
    let material;
    if (typeof c[0] == "number")
    material = new Phong({ca:c,ka:0.4,cd:c,cs:c,ks:0.7,n:10});
    else
    material = new ConditionalMaterial([new Phong({ca:c[0],ka:0.4,cd:c[0],cs:c[0],ks:0.7,n:10}), new Phong({ca:c[1],ka:0.4,cd:c[1],cs:c[0],ks:0.7,n:10})], (position, normal) => normal[1] < 0 ? 0 : 1);
    let sphere = new Sphere(x, y, r);
    sphere.render(img, material, l);
}

function renderSprite(ctx, phonemes) {

    let colors = {};
    colors.getColor = (id) => colors[id].map(c => c / 255.0);
    colors.aa = [191,29,64];
    colors.ae0 = [230,173,38];
    colors.ah = [255,242,89];
    colors.ao = [120,63,4];
    colors.aw0 = [187,187,255];
    colors.aw1 = [0,255,0];
    colors.ay = [0,153,206];
    colors.er = [225,124,167];
    colors.ey = [0,108,169];
    colors.iu = [244,190,127];
    colors.iy0 = [1,153,124];
    colors.ow1 = [137,104,158];
    colors.oy1 = [1,153,124];
    colors.ul = [221,76,54];
    colors.ch = [1,153,124];
    colors.f  = [130,101,27];
    colors.jh = [152,199,102];

    let phonemeColors = {};
    phonemeColors.getColors = (id) => phonemeColors[id];
    phonemeColors.EH = [colors.getColor("ao"), colors.getColor("iu")];
    phonemeColors.AH = colors.getColor("ah");
    phonemeColors.AO = colors.getColor("ao");
    phonemeColors.AW = [colors.getColor("aw0"), colors.getColor("aw1")];
    phonemeColors.OW = [colors.getColor("ul"), colors.getColor("ow1")];
    phonemeColors.IY = [colors.getColor("iy0"), colors.getColor("ao")];
    phonemeColors.IU = colors.getColor("iu");
    phonemeColors.ER = colors.getColor("er");
    
    let light = vec3.normalize(vec3.fromTo([0, 0, 0],[-20, -20, 50]));
    let img = ctx.createImageData(50+50*phonemes.length,50);

    for (let i = 0; i < phonemes.length; i++) {
        renderSphere(img, 50+25+i*50, 25, 20, phonemeColors.getColors(phonemes[i]), light);
    }

    /*renderSphere(img, 25, 25, 20, colors.getColor("aa"), light);
    renderSphere(img, 75, 25, 20, [colors.getColor("ae0"), colors.getColor("iu")], light);
    renderSphere(img, 125, 25, 20, colors.getColor("ah"), light);
    
    renderSphere(img, 25, 75, 20, colors.getColor("ao"), light);
    renderSphere(img, 75, 75, 20, [colors.getColor("aw0"), colors.getColor("aw1")], light);
    renderSphere(img, 125, 75, 20, colors.getColor("ay"), light);
    
    renderSphere(img, 25, 125, 20, colors.getColor("ch"), light);
    renderSphere(img, 75, 125, 20, [colors.getColor("ao"), colors.getColor("iu")], light);
    renderSphere(img, 125, 125, 20, colors.getColor("er"), light);
    
    renderSphere(img, 25, 175, 20, colors.getColor("ey"), light);
    renderSphere(img, 75, 175, 20, colors.getColor("f"), light);
    renderSphere(img, 125, 175, 20, [colors.getColor("jh"), colors.getColor("ah")], light);
    
    renderSphere(img, 25, 225, 20, colors.getColor("iu"), light);
    renderSphere(img, 75, 225, 20, [colors.getColor("iy0"), colors.getColor("ao")], light);
    renderSphere(img, 125, 225, 20, colors.getColor("jh"), light);
    
    renderSphere(img, 25, 275, 20, [colors.getColor("ul"), colors.getColor("ow1")], light);
    renderSphere(img, 75, 275, 20, [colors.getColor("ul"), colors.getColor("oy1")], light);
    renderSphere(img, 125, 275, 20, [colors.getColor("ch"), colors.getColor("iu")], light);
    
    renderSphere(img, 25, 325, 20, [colors.getColor("iu"), colors.getColor("ah")], light);
    renderSphere(img, 75, 325, 20, colors.getColor("ul"), light);
    renderSphere(img, 125, 325, 20, [colors.getColor("ow1"), colors.getColor("ey")], light);
    
    renderSphere(img, 75, 375, 20, [colors.getColor("ul"), colors.getColor("er")], light);*/
    
    return img;
}