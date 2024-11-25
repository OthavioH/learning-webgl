"use strict"

class Render {
    constructor(canvasID) {
        this.canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(canvasID));

        try {
            this.gl = /** @type {WebGLRenderingContext} */ (this.canvas.getContext("webgl"));
            this.gl.viewport(0,0,this.canvas.width, this.canvas.height);
        } catch (error) {
            var msg = "Error WebGL: " + error.toString();

            alert(msg);

            throw Error(msg);
        }

        if(!this.gl) {
            console.error("WebGL not supported");
            return;
        }

        var vertexShaderSource = document.getElementById("meu-vertex-shader").text;
        var fragmentShaderSource = document.getElementById("meu-fragment-shader").text;

        var vertexShader = Render.createSheader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);

        var fragmentShader = Render.createSheader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.programa = Render.createProgram(this.gl, vertexShader, fragmentShader);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.programa, "posicao");

        this.positionBuffer = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    } // constructor

    draw(){
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    static createSheader(/** @type {WebGLRenderingContext} */ gl, /** @type {GLenum} */ type, /** @type {String} */ source){
        
        var shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if(success){
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    static createProgram(/** @type {WebGLRenderingContext} */ gl, /** @type {WebGLShader} */ vertexShader, /** @type {WebGLShader} */ fragmentShader){
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        var success = gl.getProgramParameter(program, gl.LINK_STATUS);

        if(success){
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}