(function () {
    console.log('checking to see if i left all my logs in? well i did');

    // VARS
    // document title
    let docTitleCount = 0;
    let docTitle = [
        "/",
        "//",
        "///",
        "////",
        "/////",
        "//////",
        "///////",
        "////////",
        "/////////",
        "//////////",
        "///////////",
        "////////////",
    ];
    // ip
    let zerocool = {
        device: null,
        ip: null,
        ip2: null,
        referrer: null,
        country: null,
        city: null,
    };
    let info = document.getElementById("info");
    let deetsInt;
    let snoopDeets;
    let snoopDeetsCount = 0;
    // imgs
    let backgroundImg = document.getElementById("background-img");
    let perspective = document.getElementById("perspective");
    // three.js
    let scene, camera, form, cameraInt;
    let currentPos = 0;
    let cameraPositions = [
        [0, 0, 6],
        [10, 14, 4],
        [-5, 8, 1],
    ];
    // nav
    let checkboxes = document.getElementsByTagName('input');
    let navLinks = document.getElementsByClassName('nav-link');
    let nav = document.getElementById('nav');
    let checked = [];
    //work
    let work = document.getElementById('work');

    // FUNCTIONS
    function rando(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function titlechange() {
        document.title = docTitle[docTitleCount];
        docTitleCount = docTitleCount < docTitle.length - 1 ? docTitleCount + 1 : 0;
        setTimeout(titlechange, 500);
    };

    titlechange();

    function moveCamera() {
        let camX = rando(10, -10);
        let camY = rando(10, -10);
        let camZ = rando(10, 0);

        // save original rotation and position
        var startRotation = new THREE.Euler().copy(camera.rotation);
        var startPosition = new THREE.Vector3().copy(camera.position);

        // final rotation (with lookAt)
        camera.position.set(camX, camY, camZ);
        // camera.position.set(cameraPositions[currentPos][0], cameraPositions[currentPos][1], cameraPositions[currentPos][2]);
        camera.lookAt(form.position);
        var endRotation = new THREE.Euler().copy(camera.rotation);

        // revert to original rotation and position
        camera.rotation.copy(startRotation);
        camera.position.copy(startPosition);

        var tweenRotate = new TWEEN.Tween(camera.rotation)
        .to({ x: endRotation.x, y: endRotation.y, z: endRotation.z }, 1000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .start();

        var tweenMove = new TWEEN.Tween(camera.position)
        .to({ x: camX, y: camY, z: camZ }, 1000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .start();
    };

    cameraInt = setInterval(moveCamera, rando(10000, 3000));

    // THREE.JS
    function threeInit() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        var renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 2, 2);
        scene.add(directionalLight);

        // form 1
        var geometry = new THREE.SphereGeometry(1, 128, 128);
        // var material = new THREE.MeshNormalMaterial();
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0x00ddff,
            emissiveIntensity: 0.1,
            metalness: 0.9,
            reflectivity: 0.9,
        });
        form = new THREE.Mesh(geometry, material);
        form.position.set(0, 0, 0);
        form.scale.set(2, 3, 1);
        scene.add(form);

        camera.position.set(0, 0, 6);
        // camera.lookAt(formLocations[0][0], formLocations[0][1], formLocations[0][2]);

        var simplex = new SimplexNoise();
        var update = function () {
            var time = performance.now() * 0.00003;
            var k = 1;
            for (var i = 0; i < form.geometry.vertices.length; i++) {
                var p = form.geometry.vertices[i];
                p.normalize().multiplyScalar(
                    1 + 0.7 * simplex.noise2D(p.x * k + time, p.y * k + time)
                );
            }
            form.geometry.verticesNeedUpdate = true;
            form.geometry.computeVertexNormals();
            form.geometry.normalsNeedUpdate = true;
        };
        update();

        var animate = function () {
            requestAnimationFrame(animate);
            form.rotation.x += 0.003;
            form.rotation.y += 0.003;
            TWEEN.update();
            // update();
            renderer.render(scene, camera);
        };

        animate();
    }

    function check(e) {
        console.log(e.target.name, e.target.checked);
        if (e.target.checked) {
            checked.push(e.target.name)
        } else {
            checked = checked.filter(item => item !== e.target.name);
        };

        // if (!checked.length) {
        //     for (var i = 0; i < navLinks.length; i++) {
        //         navLinks[i].style.display = 'block';
        //     };
        // } else {
            for (var i = 0; i < navLinks.length; i++) {
                navLinks[i].style.display = 'none';
            };

            for (var i = 0; i < navLinks.length; i++) {
                checked.forEach((item) => {
                    if (navLinks[i].classList.contains(item)) {
                        navLinks[i].style.display = 'block';
                    };
                });
            };
        // };
    };

    function createPositions(elem, iter) {
        obj = {
            height: elem.offsetHeight,
            width: elem.offsetWidth,
            top: rando(window.innerHeight - elem.offsetHeight, nav.offsetHeight),
            left: rando(window.innerWidth - elem.offsetWidth, 0),
            created: iter
        };

        for (var i = 0; i < positions.length; i++) {
            if (
                (obj.top >= positions[i].top - obj.height && obj.top <= positions[i].top + positions[i].height) &&
                (obj.left >= positions[i].left - obj.width && obj.left <= positions[i].left + positions[i].width)
            ) {
                createPositions(elem, iter + 1);
                return;
            };
        };

        positions.push(obj);
    };

    // OTHER
    let positions = [];

    async function posLoop() {

        for (var i = 0; i < navLinks.length; i++) {
            let target = navLinks[i]
            await createPositions(navLinks[i], 1);
        };

    };

    posLoop().then(() => {
        console.log(positions);
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].style.top = `${positions[i].top}px`;
            navLinks[i].style.left = `${positions[i].left}px`;
        };
    }).then(() => {
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].style.display = 'none';
            navLinks[i].style.opacity = '1';
        };
    });

    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('click', (e) => {check(e)});
    };

    // setTimeout(() => (backgroundImg.style.opacity = "1"), 1000);
    setTimeout(() => threeInit(), 0);
})();
