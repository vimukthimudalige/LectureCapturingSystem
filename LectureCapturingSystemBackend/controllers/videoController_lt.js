// Import libraries
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cmd = require('node-cmd');
const csv = require('csvtojson');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

//Import models
const videoModel = new require('../models/video_lt');
// const videoChapterModel = new require('../models/videoChapter_lt');

// Import configuration file
const config = require('../configurations/config');

router.use(bodyParser.json());

// Function to upload video from the OBS studio plugin
module.exports.uploadVideo = function (req,res) {
    console.log("uploading video");
    const videoSavingPath = config.videoSavingPath;

    // If directory to save videos does not exist, make a directory
    if (!fs.existsSync(videoSavingPath))
    {
        fs.mkdirSync(videoSavingPath);
    }

    // Get the video file from the request
    const videoFile = req.files.lectureVideo;

    // console.log(videoFile);

    const mimeType = videoFile.mimetype.substring(0, 5);
    console.log(mimeType);

    if(mimeType === 'video')
    {
        // Replace spaces and append timestamp to video filename
        let modifiedVideoFilename = videoFile.name.replace(/\s/g,'_');
        const dateTime = new Date();
        console.log('dateTime:' + dateTime);

        const timestamp = dateTime.getTime();
        modifiedVideoFilename = timestamp + '_' + modifiedVideoFilename;
        console.log("modified: " + modifiedVideoFilename);

        // Save the video in the location
        videoFile.mv(videoSavingPath + modifiedVideoFilename, function(err) {
            if (err)
            {
                res.json({
                    success: false,
                    msg: err
                });
            }
            else
            {
                // Get other values from the request and add them to schema model object
                let video = new videoModel();
                video.subject = req.body.subject;
                video.videoName = req.body.videoName;
                video.lectureVideo = modifiedVideoFilename;
                video.dateTime = dateTime;
                video.status = 'unprocessed';

                // Save in database
                video.save(function(err) {
                    if (err)
                    {
                        res.json({
                            success: false,
                            msg: err
                        });
                    }
                    else
                    {
                        res.json({
                            success:true,
                            msg:'Video uploaded successfully'
                        });
                    }

                });
            }

        });
    }
    else
    {
        res.json({
            success: false,
            msg: 'Invalid file type.'
        });
    }

};

// Get all lecture videos
module.exports.getAllVideos = function (req, res) {
    videoModel.find({}, function (error, videos) {
        if(error){
            res.json({
                success: false,
                msg: error
            });
        }
        else
        {
            res.json(videos);
        }
    });
};

// Get a single video
module.exports.getOneVideo = function (req, res) {
    videoModel.find({'lectureVideo': req.query.lectureVideo}, function (error, response) {
        if(error)
        {
            res.json({
                success: false,
                msg: error
            });
        }
        else
        {
            res.json(response);
        }
    })
};

//TEST
module.exports.test = function (req, res) {
    console.log('creating chapters');

    const chapterName = req.body.lectureVideo.toString().substr(0, req.body.lectureVideo.length-4);

    // Create an object of SpeechToText
    const speech_to_text = new SpeechToTextV1({
        "username": "c70e62af-7ac6-4b2b-8c03-2c29c90bca0a",
        "password": "ZsN5o7UPmqQi"
    });

    cmd.get(
        'scenedetect -i ' + config.videoSavingPath + req.body.lectureVideo + ' -d content -t 2 -o ' + config.videoSavingPath + chapterName + '_chapter.mp4 -co ' + config.videoSavingPath +'scenes.csv -q',
        function(err, data, stderr){
            if(err){
                console.log("error");
                res.json({
                    success: false,
                    msg: err
                });
            }
            else if(data){
                console.log("data");
                console.log(data);

                // Array to hold video chapter names
                const videoChapters = [];

                // Array to hold video chapters' text
                const videoChaptersText = [];

                const csvFilePath= config.videoSavingPath + 'scenes.csv';
                csv()
                    .fromFile(csvFilePath)
                    .then((jsonObjArray)=>{
                        console.log('json');
                        // console.log(jsonObjArray);
                        console.log('length:' + jsonObjArray.length);

                        if(jsonObjArray.length<12 )
                        {
                            for(let i=1; i<jsonObjArray.length; i++)
                            {
                                let chapter = chapterName + '_chapter-00' + i + '.mp4';
                                // console.log(chapter);
                                // Add video chapter to array
                                videoChapters.push(chapter);

                                // Convert video to audio using ffmpeg
                                const proc = new ffmpeg({ source: config.videoSavingPath + chapter, nolog: true });
                                proc.setFfmpegPath(config.ffmpegPath)
                                    .toFormat('mp3')

                                    .on('end', function() {
                                        console.log('Video file converted to audio successfully');

                                        // Convert the audio to text
                                        const params = {
                                            audio: fs.createReadStream(config.videoSavingPath + chapterName + '_chapter-00' + i + '.mp3'),
                                            content_type: 'audio/mp3'
                                        };

                                        speech_to_text.recognize(params, function (error, transcript) {
                                            if (error)
                                            {
                                                console.log('Error:'+  error);
                                            }
                                            else
                                            {
                                                console.log('success');
                                                // console.log(transcript);

                                                let text = '';

                                                for(let i=0; i<transcript.results.length; i++)
                                                {
                                                    text = text + transcript.results[i].alternatives[0].transcript;
                                                    console.log(transcript.results[i].alternatives[0].transcript);
                                                    console.log('NEW');
                                                }
                                                // console.log(JSON.stringify(transcript, null, 2));
                                                // console.log(transcript.results[0].alternatives[0].transcript);
                                                //     console.log(transcript.results[1].alternatives[0].transcript);
                                                // videoChaptersText.push(text);

                                                // Update videoChaptersText array
                                                /*videoModel.update({'lectureVideo': req.body.lectureVideo}, {$push: {'videoChaptersText': text}}, (errorTxt, ResponseTxt) => {
                                                   if(errorTxt)
                                                   {
                                                       console.log('Error pushing text to db.');


                                                   }
                                                   else
                                                   {
                                                       console.log('Successfully pushed text to db.');

                                                   }
                                                });*/

                                                //
                                                let videoChapter = new videoChapterModel();
                                                videoChapter.lectureVideo = req.body.lectureVideo;
                                                videoChapter.videoChapter = chapter;
                                                videoChapter.videoChapterText = text;

                                                videoChapter.save((error) => {
                                                    if(error)
                                                    {
                                                        console.log(error);
                                                    }
                                                    else
                                                    {
                                                        console.log('Successfully pushed ' + chapter + ' to db.');
                                                    }
                                                });

                                            }
                                        });
                                    })
                                    .on('error', function(err) {
                                        console.log('Error: ' + err.message);
                                    })
                                    // save to audio file
                                    .saveToFile(config.videoSavingPath + chapterName + '_chapter-00' + i + '.mp3');
                            }

                            console.log('array');
                            console.log(videoChapters);
                            console.log(videoChaptersText);

                        }
                        else
                        {
                            for(let i=1; i<10; i++)
                            {
                                console.log('1 to 10');
                                console.log(i);
                            }

                            for(let i=10; i<jsonObjArray.length; i++)
                            {
                                console.log('10 to length');
                                console.log(i);
                            }
                        }

                        // Append video chapters and text array to request body
                        req.body.videoChapters = videoChapters;
                        // req.body.videoChaptersText = videoChaptersText;

                        // Update status to processed in database
                        videoModel.findOneAndUpdate({'lectureVideo': req.body.lectureVideo}, req.body, function (error, success) {
                            if(error)
                            {
                                console.log(error);

                            }
                            else
                            {
                                console.log('wrote video chapters to db');

                            }
                        });

                    });

            }
            else if(stderr){
                console.log("stderr");
                console.log(stderr);
                res.json({
                    success: false,
                    msg: stderr
                });
            }
        }
    );
};

// Async function to create video chapters by splitting a video
module.exports.createVideoChapters = async(req, res) => {
    console.log('creating chapters');

    // Remove dot and extension from video file
    const chapterName = req.body.lectureVideo.toString().substr(0, req.body.lectureVideo.length-4);

    const videoSplitCommand = 'scenedetect -i ' + config.videoSavingPath + req.body.lectureVideo + ' -d content -t 2 -o ' + config.videoSavingPath + chapterName + '_chapter.mp4 -co ' + config.videoSavingPath +'scenes.csv -q';
    const csvFilePath = config.videoSavingPath + 'scenes.csv';
    let jsonObjArray;
    const audioFormat = 'audio/mp3';
    let audio;
    let text;

    // Array to hold video chapters
    const videoChapters = [];

    console.log("chapterName: " + chapterName);

    // Split the video file into chapters
    try
    {
        console.log('splitting video');
        const splitVideoToChaptersResult = await splitVideoToChapters(videoSplitCommand);
        console.log(splitVideoToChaptersResult);
    }
    catch (e)
    {
        console.log('Error when splitting video:');
        console.log(e);
    }

    // Convert the csv file to json
    try
    {
        console.log('converting csv to json');

        jsonObjArray = await csv().fromFile(csvFilePath);

        // console.log(jsonObjArray);
        console.log('length:' + jsonObjArray.length);
    }
    catch (e)
    {
        console.log('Error when converting csv file to json');
        console.log(e);
    }

    for(let i=1; i<jsonObjArray.length; i++)
    {
        // Create name for each video chapter
        let chapter = chapterName + '_chapter-00' + i + '.mp4';

        // Convert video chapter to audio
        try {
            audio = await convertVideoToAudio(chapter, chapterName, i);
            console.log(audio);
        }
        catch (e) {
            console.log('Error when converting video to audio');
            console.log(e);
        }

        // Convert audio to text
        try {
            text = await convertAudioToText(audio, audioFormat);
        }
        catch (e) {
            console.log('Error when converting audio to text');
            console.log(e);
        }

        // Add video chapter to array
        videoChapters.push({"videoChapterVideo":chapter, "videoChapterText":text});
    }


    req.body.videoChapters = videoChapters;
    console.log(req.body);

    // Update status to processed in database
    videoModel.findOneAndUpdate({'lectureVideo': req.body.lectureVideo}, req.body, function (error, success) {
        if(error)
        {
            console.log("Error during writing to database.");
            console.log(error);
            res.json({
                success: false,
                msg: error
            });
        }
        else
        {
            console.log('Wrote to database successfully');
            res.json({
                success: true,
                msg: "Video chapters created successfully."
            });
        }
    });

    console.log('done');

};

// Promise to split a video into chapters
let splitVideoToChapters = (videoSplitCommand) => {
    return new Promise((resolve, reject) => {
        console.log('command: ' + videoSplitCommand);

        cmd.get(videoSplitCommand, function(err, data, stderr) {
                if (err)
                {
                    reject(err);
                }
                else if (data)
                {
                    resolve(data);
                }
                else if (stderr)
                {
                    reject(err);
                }
            });
    });
};

// Promise to convert video chapter to audio
let convertVideoToAudio = (chapter, chapterName, number) => {
    return new Promise((resolve, reject) => {
        let videoToConvert = new ffmpeg({ source: config.videoSavingPath + chapter, nolog: true });

        videoToConvert.setFfmpegPath(config.ffmpegPath)
            .toFormat('mp3')

            .on('end', function() {
                resolve(config.videoSavingPath + chapterName + '_chapter-00' + number + '.mp3');
            })
            .on('error', function(err) {
                reject(err);
            })
            // save to audio file
            .saveToFile(config.videoSavingPath + chapterName + '_chapter-00' + number + '.mp3');

    });
};

// Promise to convert audio to text
let convertAudioToText = (audio, audioFormat) => {
    return new Promise((resolve, reject) => {
        // Create an object of SpeechToText
        const speech_to_text = new SpeechToTextV1({
            "username": config.bluemixSpeechToTextUsername,
            "password": config.bluemixSpeechToTextPassword
        });

        // Parameters of the audio file
        const params = {
            audio: fs.createReadStream(audio),
            content_type: audioFormat
        };

        speech_to_text.recognize(params, function (error, transcript) {
            if (error) {
                reject(error);
            }
            else {
                let text = '';

                for (let i = 0; i < transcript.results.length; i++) {
                    text = text + transcript.results[i].alternatives[0].transcript;
                    // console.log(transcript.results[i].alternatives[0].transcript);
                    // console.log('NEW');
                }

                resolve(text);
            }
        });
    });
};