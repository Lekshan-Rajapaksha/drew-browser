// New Tab Area Light WGSL Shader
// Models the command bar as an area light source with solid-angle irradiance calculation.

struct Uniforms {
    bar_rect: vec4f,
    lift: f32,
    falloff: f32,
    intensity: f32,
    time: f32,
    resolution: vec2f,
    is_dark_mode: u32,
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
    let p = in.uv * u.resolution;
    let bar_center = u.bar_rect.xy + u.bar_rect.zw * 0.5;
    let dist = length(p - bar_center);
    let falloff_factor = pow(u.lift / max(dist, 1.0), u.falloff) * u.intensity;

    let base_color = vec3f(0.012, 0.345, 0.969); // #0358F7 blue
    return vec4f(base_color * falloff_factor, clamp(falloff_factor, 0.0, 1.0));
}

