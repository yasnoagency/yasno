
class Ocean {
	constructor(parent) {
		this.parent = parent;

		this.start = Date.now();

		const waterGeometry = new THREE.CircleGeometry(100, 200)
		this.water = new THREE.Water(
				waterGeometry,
				{
					textureWidth: 512,
					textureHeight: 512,
					waterNormals: new THREE.TextureLoader().load( 'https://touch3d.net/intr_3d/img/waternormals.jpg', function ( texture ) {

						texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

					} ),
					sunDirection: new THREE.Vector3(),
					sunColor: 0xffffff,
					waterColor: 0x001e0f,
					distortionScale: 3.7//,
				}
			);

		this.water.rotation.x = - Math.PI / 2.0;
		this.water.position.y = -40.0;
		this.water.position.z = 0.0;
		this.fillTrackProfiles();
		this.parent.add( this.water );
	}

	fillTrackProfiles() {
		this.tracks = new TrackProfiler();
		this.tracks.addTrack( default_profile.ocean_keys );
		profiles.list.forEach(profile => this.tracks.addTrack( profile.ocean_keys ))
	}

	update() {
		let time = Date.now();

		const track = this.tracks.getActiveTrack();
		const point = track.getPoint();
		this.water.position.set( point.x, point.y, point.z );

		let temp_world_pos = new THREE.Vector3();
		const world_position = this.water.getWorldPosition(temp_world_pos);
		this.water.lookAt( new THREE.Vector3( world_position.x, world_position.y+1.0, world_position.z ) );

		this.water.material.uniforms[ 'time' ].value += (time - this.start) * 0.0005;
		this.start = time;
	}
}
