// 2D noise utilities for WGPU/WGSL
// hash12: Dave Hoskins' hash (https://www.shadertoy.com/view/4djSRW)
// simplex_noise_2d: IQ-style 2D simplex noise
// triangular_dither: ±3/255 triangular dither (README "±3/255 triangular dither")

fn hash12(p: vec2f) -> f32 {
    var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
    p3 = p3 + dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

fn hash22(p: vec2f) -> vec2f {
    var p3 = fract(vec3f(p.x, p.y, p.x) * vec3f(0.1031, 0.1030, 0.0973));
    p3 = p3 + dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

fn simplex_noise_2d(v: vec2f) -> f32 {
    let C = vec4f(0.211324865405187,   // (3 - sqrt(3)) / 6
                  0.366025403784439,   // (sqrt(3) - 1) / 2
                  -0.577350269189626,  // -1 + 2 * C.x
                  0.024390243902439);  // 1 / 41
    var i  = floor(v + dot(v, C.yy));
    let x0 = v - i + dot(i, C.xx);
    let i1  = select(vec2f(0.0, 1.0), vec2f(1.0, 0.0), x0.x > x0.y);
    var x12 = x0.xyxy + C.xxzz;
    x12 = vec4f(x12.xy - i1, x12.zw);
    i = fract(i);
    let p = vec3f(
        dot(i + vec2f(0.0), vec2f(127.1, 311.7)),
        dot(i + i1,         vec2f(127.1, 311.7)),
        dot(i + vec2f(1.0), vec2f(127.1, 311.7)),
    );
    let m3 = max(vec3f(0.5) - vec3f(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), vec3f(0.0));
    let m3sq = m3 * m3;
    let m3q4 = m3sq * m3sq;
    let ph = fract(sin(p) * 43758.5453);
    let g = vec3f(
        dot(ph.x * 2.0 - 1.0, x0.x)  + dot(fract(ph.x * 2.0 + 1.0) * 2.0 - 1.0, x0.y),
        dot(ph.y * 2.0 - 1.0, x12.x) + dot(fract(ph.y * 2.0 + 1.0) * 2.0 - 1.0, x12.y),
        dot(ph.z * 2.0 - 1.0, x12.z) + dot(fract(ph.z * 2.0 + 1.0) * 2.0 - 1.0, x12.w),
    );
    return 130.0 * dot(m3q4, g);
}

// ±3/255 triangular dither using hash12.
// Returns a value in [-3/255, +3/255] suitable for addition to an sRGB output.
fn triangular_dither(pos: vec2f) -> f32 {
    let r1 = hash12(pos);
    let r2 = hash12(pos + vec2f(31.7, 17.3));
    // triangular distribution: sum of two uniforms → tent [-1,1], scale to ±3/255
    return (r1 + r2 - 1.0) * (3.0 / 255.0);
}
