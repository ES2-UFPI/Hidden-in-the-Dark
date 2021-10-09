

export default anims_pers = create.anims;
anims.create({
    key: "leftWalk",
    frames: anims.generateFrameNames(this.name, { start: 16, end: 19 }),
    frameRate: 10,
    repeat: -1,
});
anims.create({
    key: "rightWalk",
    frames: anims.generateFrameNames(this.name, { start: 12, end: 15 }),
    frameRate: 10,
    repeat: -1,
});

anims.create({
    key: "leftIdle",
    frames: anims.generateFrameNames(this.name, { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1,
});
anims.create({
    key: "rightIdle",
    frames: anims.generateFrameNames(this.name, { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1,
});