import * as THREE from '../../libs/three/three.module.js';
import { VRButton } from '../../libs/VRButton.js';
import { BoxLineGeometry } from '../../libs/three/jsm/BoxLineGeometry.js';
import { GLTFLoader } from '../../libs/three/jsm/GLTFLoader.js';
import { Stats } from '../../libs/stats.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';
import { SpotLightVolumetricMaterial } from '../../libs/SpotLightVolumetricMaterial.js';


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
        
        const geometry = new THREE.IcosahedronBufferGeometry( this.radius);

        for ( let i = 0; i < 200; i ++ ) {

            const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            object.position.x = this.random( -2, 2 );
            object.position.y = this.random( -2, 2 );
            object.position.z = this.random( -2, 2 );

            this.room.add( object );

        }
        
        this.highlight = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } ) );
        this.highlight.scale.set(1.2, 1.2, 1.2);
    }
    
    setupXR(){
        this.renderer.xr.enabled = true;
        
        const button = new VRButton( this.renderer );
        
        const self = this;
        
        function onSelectStart() {
            
            this.userData.selectPressed = true;
            if (self.spotlight) self.spotlight.visible = true;
        }

        function onSelectEnd() {

            self.highlight.visible = false;
            this.userData.selectPressed = false;
            if (self.spotlight) self.spotlight.visible = false;
            
        }
        
        this.controller = this.renderer.xr.getController( 0 );
        this.controller.addEventListener( 'selectstart', onSelectStart );
        this.controller.addEventListener( 'selectend', onSelectEnd );
        this.controller.addEventListener( 'connected', function ( event ) {

            self.buildController.call(self, event.data, this );

        } );
        this.controller.addEventListener( 'disconnected', function () {

            while(this.children.length>0) this.remove( this.children[ 0 ] );
            self.controller = null;

        } );
        this.scene.add( this.controller );
 
        this.scene.add(this.highlight);

    }
    
    buildController( data, controller ) {
        let geometry, material, loader;
        
        const self = this;
        
        switch ( data.targetRayMode ) {
            
            case 'tracked-pointer':
                //Enter code here

                //Initialises new loader to load in model of flashlight
                loader = new GLTFLoader().setPath('../../libs/');
        
                loader.load( 'flash-light.glb',
                    ( gltf ) => {
                    //Original flashlight was too big, below code resizes the flashlight 
                    //to a better size.
                    //The scene includes a camera and light but they arent needed
                    //therefore only the flashlight model is included.
                    const flashLight = gltf.scene.children[2];
                    const scale = 0.6;
                    flashLight.scale.set( scale, scale, scale );
                    controller.add( flashlight );
                    self.spotlight = new THREE.Group();

                    //Creates a spotlight which emmits from the controller
                    const spotlight = new THREE.Spotlight( 0xFFFFFF, 2, 12, Mth.PI/15, 0.3);
                    //Creates a cone object to enhace the look of the light beam coming out of the torch
                    geometry = new THREE.CylinderBufferGeometry( 0.03, 1, 5, 32, true);
                    //Creates the radius of the cone and rotates it
                    geometry.rotateX( Math.PI/2 );
                    material = new SpotLightVolumetricMaterial();
                    const cone = new THREE.Mesh( geometry, material );
                    //Moves the position of the cone along the flashlight object 
                    cone.translateZ( -2.6 );
                    //Adds the cone to the spotlight group
                    
                    //Spotlight constructor includes 5 parameters
                    //1 - Color - Int defining colour (hex)
                    //2 - Intensity - Float defining how strong the light is
                    //3 - Distance - How far the light travels before reaching 0
                    //4 - Angle - The angle and how wide the light cone is.
                    //5 - Penumbra - Defines how bright the center of the light is.
                    spotlight.position.set(0,0,0);
                    //Positions the spotlight to its target ray direction
                    spotlight.target.position.set(0,0,-1);
                    //Both spotlight.position and .target are added to group instance of spotlight.
                    self.spotlight.add( spotlight.target );
                    self.spotlight.add( spotlight );
                    self.spotlight.add( cone );

                    controller.add( self.spotlight );
                    self.spotlight.visible = false;

                    




                }),
                    null,
                    (error) => {
                        console.error('An error ocurred');
                    }
                
                break;
                
            case 'gaze':

                geometry = new THREE.RingBufferGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
                material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
                controller.add( new THREE.Mesh( geometry, material ) )

        }

    }
    
    handleController( controller ){
        if (controller.userData.selectPressed ){
            this.workingMatrix.identity().extractRotation( controller.matrixWorld );

            this.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
            this.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.workingMatrix );

            const intersects = this.raycaster.intersectObjects( this.room.children );

            if (intersects.length>0){
                intersects[0].object.add(this.highlight);
                this.highlight.visible = true;
            }else{
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
        if (this.controller ) this.handleController( this.controller );
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };