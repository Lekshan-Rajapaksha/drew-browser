// Window Backdrop WGSL Shader
// Gradient stops interpolated in OKLab space with grain texture overlay.

struct Uniforms {
    stops: array<vec4f, 3>,
    grain_opacity: f32,
    time: f32,
    resolution: vec2f,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
};

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
    var pos = array<vec2f, 6>(
        vec2f(-1.0, -1.0),
        vec2f( 1.0, -1.0),
        vec2f(-1.0,  1.0),
        vec2f(-1.0,  1.0),
        vec2f( 1.0, -1.0),
        vec2f( 1.0,  1.0),
    );
    var out: VertexOutput;
    out.position = vec4f(pos[vertex_index], 0.0, 1.0);
    out.uv = pos[vertex_index] * 0.5 + 0.5;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4f {
    let t = in.uv.y;
    let stop0 = u.stops[0].rgb;
    let stop1 = u.stops[1].rgb;
    let stop2 = u.stops[2].rgb;

    var color_oklab: vec3f;
    if (t < 0.5) {
        color_oklab = mix(stop0, stop1, t * 2.0);
    } else {
        color_oklab = mix(stop1, stop2, (t - 0.5) * 2.0);
    }

    return vec4f(color_oklab, 1.0);
}

