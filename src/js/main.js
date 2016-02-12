import GitHub from 'github-api';

const github = new GitHub({});
const repo = github.getRepo('bobogei81123', 'bcw_codebook');

let promise = new Promise( (resolve, reject) => {
    repo.getTree('master?recursive=true', 
        (err, tree) => {
            resolve(tree);
        });
});

promise.then( (tree) => {
    const len = tree.length;
    let r = Math.floor(Math.random() * len);
    let file = tree[r].path;
    file = 'codes/Math/PollardRho.cpp'
    repo.contents('master', file, (err, contents) => {
        let text = window.atob(contents.content);
        $('#finished').text(text.substring(0, 10));
        $('#current').text(text.substring(10, 11));
        $('#unfinished').text(text.substring(11));
    });
});

$('body').keypress( (e) => {
    console.log(e);
    let target = $('#current').text();
    if (e.key == target || target == '\n' || target == '\t') {
        let finished = $('#finished').text() + target;
        let un = $('#unfinished').text();
        $('#finished').text(finished);
        $('#current').text(un.substring(0, 1));
        $('#unfinished').text(un.substring(1));
    }
    e.preventDefault();
});
