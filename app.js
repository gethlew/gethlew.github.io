import * as THREE from '../../libs/three/three.module.js';
import { VRButton } from '../../libs/VRButton.js';
import { XRControllerModelFactory } from '../../libs/three/jsm/XRControllerModelFactory.js';
import { BoxLineGeometry } from '../../libs/three/jsm/BoxLineGeometry.js';
import { Stats } from '../../libs/stats.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';


class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.camera.position.set( 0, 1.6, 3 );
        
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x505050 );

		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 1.6, 0);
        this.controls.update();
        
        this.stats = new Stats();
        document.body.appendChild( this.stats.dom );
        
        this.raycaster = new THREE.Raycaster();
        this.workingMatrix = new THREE.Matrix4();
        this.workingVector = new THREE.Vector3();
        
        this.initScene();
        this.setupXR();
        
        window.addEventListener('resize', this.resize.bind(this) );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
	}	
    
    random( min, max ){
        return Math.random() * (max-min) + min;
    }
    
    initScene(){
        this.radius = 0.08;
        
        this.room = new THREE.LineSegments(
					new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
					new THREE.LineBasicMaterial( { color: 0x808080 } )
				);
        this.room.geometry.translate( 0, 3, 0 );
        this.scene.add( this.room );
        
        // Below code creates the objects viewable in the scene.
        const geometry = new THREE.IcosahedronBufferGeometry( this.radius , 2);

        //for loop which is used to render 200 of the above object.
        for ( let i = 0; i < 200; i ++ ) {

            //creates a "geometry" instance and gives it a random color, position and rotation
            //Due to the above for loop, the following lines of code are repeated 200 times.
            const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            object.position.x = this.random( -2, 2 );
            object.position.y = this.random( -2, 2 );
            object.position.z = this.random( -2, 2 );

            //adds the object to a preivously initialised room
            this.room.add( object );
        }
        
        //creates a "highlight" which surrounds an object when a controller is pointed towards it.
        //It takes the previously created "geometry" object and uses it as a parameter.
        this.highlight = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } ) );
        this.highlight.scale.set(1.2, 1.2, 1.2);
        this.scene.add(this.highlight);
    }
    
    setupXR(){
        this.renderer.xr.enabled = true;
        
        const button = new VRButton( this.renderer );
        
        const self = this;
        
        //intialises vr controllers
        this.controllers = this.buildControllers();
        
        //Called when button is pressed on vr controller
        function onSelectStart() {
            
            this.children[0].scale.z = 10;
            this.userData.selectPressed = true;
        }

        //Called when button is released on vr controller
        function onSelectEnd() {

            this.children[0].scale.z = 0;
            self.highlight.visible = false;
            this.userData.selectPressed = false;
            
        }
        
        //For each controller the above functions are repeated
        this.controllers.forEach( (controller) => {
            controller.addEventListener( 'selectstart', onSelectStart );
            controller.addEventListener( 'selectend', onSelectEnd );
        });
    
    }
    
    buildControllers() {
        const controllerModelFactory = new XRControllerModelFactory();

        //A line which will protrude from the point of the controller
        //The line is used to select objects using VR controllers
        const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

        const line = new THREE.Line( geometry );
        line.name = 'line';
		line.scale.z = 0;
        
        const controllers = [];
        
        //For loop executes as many times as there are VR controllers.
        for(let i=0; i<=1; i++){
            const controller = this.renderer.xr.getController( i );
            controller.add( line.clone() );
            controller.userData.selectPressed = false;
            this.scene.add( controller );
            
            controllers.push( controller );
            
            const grip = this.renderer.xr.getControllerGrip( i );
            grip.add( controllerModelFactory.createControllerModel( grip ) );
            this.scene.add( grip );
        }
        
        return controllers;
    }
    
    
    handleController( controller ){
        if (controller.userData.selectPressed ){
            //The line extending out of the controller is extended for 10 meters
            controller.children[0].scale.z = 10;

            //Gets the position of the VR Controller and applies it to a variable
            this.workingMatrix.identity().extractRotation( controller.matrixWorld );

            //Gets the origin from the position of the VR Controller and applies
            //it to a variable.
            this.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
            
            //Applies the position of the ray/line, to the position of the controller
            this.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.workingMatrix );

            //An array of objects which intersect with the line/ray
            //Array is arranged by which objects are closest to the controller, with the 
            //object that is closest to the controller first.
            const intersects = this.raycaster.intersectObjects( this.room.children );

            //If statetment where if one or more objects are in the above array
            //A hilight is added to the first object within the array.
            if (intersects.length>0){
                intersects[0].object.add(this.highlight);
                this.highlight.visible = true;
                controller.children[0].scale.z = intersects[0].distance;
            }else{
                //If there are no intersections, highlight doesn't appear.
                this.highlight.visible = false;
            }
        }
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.stats.update();
        
        if (this.controllers ){
            const self = this;
            this.controllers.forEach( ( controller) => { 
                self.handleController( controller ) 
            });
        }
        
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };