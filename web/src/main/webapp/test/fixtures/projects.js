(function (fx) {

    fx.project('rails', {
        name: 'Ruby on Rails',
        points: 100,
        sprints: [{
            planned: 10,
            done: 10
        }, {
            planned: 12,
            done: 10
        }, {
            planned: 10,
            done: 8,
            added: 2
        }, ]
    });

})(yawp.fixtures.lazy);