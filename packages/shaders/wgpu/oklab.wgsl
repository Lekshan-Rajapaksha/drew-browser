// OKLab color space utilities for WGPU/WGSL
// Math from Björn Ottosson's OKLab spec and the Ardia Metal shaders.
//
// M1: linear sRGB → LMS (cube-root compressed)
// M2: LMS → OKLab

fn linear_srgb_to_oklab(c: vec3f) -> vec3f {
    let l = pow(0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b, 1.0 / 3.0);
    let m = pow(0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b, 1.0 / 3.0);
    let s = pow(0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b, 1.0 / 3.0);
    return vec3f(
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
    );
}

fn oklab_to_linear_srgb(lab: vec3f) -> vec3f {
    let l_ = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
    let m_ = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
    let s_ = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
    let l = l_ * l_ * l_;
    let m = m_ * m_ * m_;
    let s = s_ * s_ * s_;
    return vec3f(
         4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    );
}

fn linear_to_srgb_channel(c: f32) -> f32 {
    let a = abs(c);
    if a <= 0.0031308 {
        return c * 12.92;
    }
    return sign(c) * (1.055 * pow(a, 1.0 / 2.4) - 0.055);
}

fn oklab_to_srgb(lab: vec3f) -> vec3f {
    let lin = oklab_to_linear_srgb(lab);
    return vec3f(
        linear_to_srgb_channel(lin.r),
        linear_to_srgb_channel(lin.g),
        linear_to_srgb_channel(lin.b),
    );
}

fn srgb_to_linear_channel(c: f32) -> f32 {
    if c <= 0.04045 {
        return c / 12.92;
    }
    return pow((c + 0.055) / 1.055, 2.4);
}

fn srgb_to_oklab(c: vec3f) -> vec3f {
    let lin = vec3f(
        srgb_to_linear_channel(c.r),
        srgb_to_linear_channel(c.g),
        srgb_to_linear_channel(c.b),
    );
    return linear_srgb_to_oklab(lin);
}

fn oklab_mix(a: vec3f, b: vec3f, t: f32) -> vec3f {
    return mix(a, b, t);
}
