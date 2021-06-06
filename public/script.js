(function () {
    console.log('checking to see if i left all my logs in? well i did');

    document.addEventListener('touchmove', function (event) {
        if (event.scale !== 1) { event.preventDefault(); }
    }, { passive: false });

    // VARS
    // document title
    let docTitleCount = 0;
    let docTitle = [
        // "/",
        // "//",
        // "///",
        // "////",
        // "/////",
        // "//////",
        // "///////",
        // "////////",
        // "/////////",
        // "//////////",
        // "///////////",
        // "////////////",
        'g',
        'gi',
        'giv',
        'give',
        'give m',
        'give me',
        'give me a',
        'give me a j',
        'give me a jo',
        'give me a job',
        'give me a job p',
        'give me a job pl',
        'give me a job plz',
        '* give me a job plz *',
        'give me a job plz',
        '* give me a job plz *',
        'give me a job plz',
        '* give me a job plz *',
    ];
    // three.js
    let scene, camera, form, cameraInt;
    // nav
    let checkboxes = document.getElementsByTagName('input');
    let labels = document.getElementsByTagName('label');
    let nav = document.getElementById('nav');
    let checked = [];
    let navLinks = document.getElementsByClassName('nav-link');

    //work
    let work = document.getElementById('work');

    let background = document.getElementById('background-grad');
    background.style.background = `radial-gradient(ellipse at 10% 10%, rgba(${rando(255, 0)}, ${rando(255, 0)}, ${rando(255, 0)}, ${rando(1, 0)}), transparent), radial-gradient(ellipse at 80% 90%, rgba(${rando(255, 0)}, ${rando(255, 0)}, ${rando(255, 0)}, ${rando(1, 0)}), rgba(${rando(255, 0)}, ${rando(255, 0)}, ${rando(255, 0)}, ${rando(1, 0)}))`;

    // FUNCTIONS
    function rando(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function randoHex() {
        let hex =  "000000".replace(/0/g,function(){return (~~(Math.random()*16));});
        console.log(parseInt(hex));
        return parseInt(hex);
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

    // cameraInt = setInterval(moveCamera, rando(10000, 3000));

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

        scene.fog = new THREE.Fog(0x00ff00, 10, 100);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 2, 2);
        scene.add(directionalLight);

        // form 1
        var geometry = new THREE.SphereGeometry(1, 128, 128);
        let col = randoHex();
        var material = new THREE.MeshPhongMaterial({
            color: col,
            specular: randoHex(),
            emissive: randoHex(),
            emissiveIntensity: 0.5,
            shininess: 20,
        });
        console.log(material);
        form = new THREE.Mesh(geometry, material);
        form.position.set(0, 0, 0);
        form.scale.set(2, 3, 1);
        scene.add(form);

        camera.position.set(0, 0, 6);

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

        moveCamera();

        if (e.target.checked) {

            checked.push(e.target.name);

            Array.from(navLinks).forEach(elem => {
                if (elem.classList.contains(e.target.name)) {
                    elem.style.transition = `opacity ${rando(0.6, 0.3)}s linear`;
                    elem.style.display = 'block';
                    setTimeout(() => {
                        elem.style.opacity = '1';
                    }, 10);
                };
            });

        } else {

            checked = checked.filter(item => item !== e.target.name);

            Array.from(navLinks).forEach(elem => {
                if (elem.classList.contains(e.target.name)) {
                    elem.style.transition = `opacity 0.2s linear`;
                    elem.style.opacity = '0';
                    setTimeout(() => {
                        elem.style.display = 'none';
                    }, 300);
                };
            });

        };

    };

    function createPositions(elem, iter) {
        obj = {
            height: elem.offsetHeight,
            width: elem.offsetWidth * 1.6,
            top: rando(window.innerHeight - elem.offsetHeight - nav.offsetHeight - 20, 10),
            left: rando(window.innerWidth - (elem.offsetWidth * 1.6), 0),
            created: iter,
        };

        for (var i = 0; i < positions.length; i++) {
            if (
                (obj.top >= positions[i].top - obj.height && obj.top <= positions[i].top + positions[i].height)
            ) {
                console.log(elem, iter);
                createPositions(elem, iter + 1);
                return;
            };
        };

        positions.push(obj);
        elem.style.top = `${obj.top}px`;
        elem.style.left = `${obj.left}px`;
        elem.style.width = `${obj.width}px`;
    };

    // OTHER
    let positions = [];

    async function posLoop() {

        for (var i = 0; i < navLinks.length; i++) {
            await createPositions(navLinks[i], 1);
        };

    };

    posLoop().then(() => {
        console.log('positions', positions);
    }).then(() => {
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].style.display = 'none';
        };
    });

    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('click', (e) => {check(e)});
    };

    setTimeout(() => threeInit(), 0);
})();
