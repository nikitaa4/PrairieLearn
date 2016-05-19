var fs = require('fs');
var async = require('async');
var pg = require('pg');

var config = require('./config');

var enumMode = fs.readFileSync('./models/enum_mode.sql', 'utf8');
var enumQuestionType = fs.readFileSync('./models/enum_question_type.sql', 'utf8');
var enumRole = fs.readFileSync('./models/enum_role.sql', 'utf8');
var enumSubmissionType = fs.readFileSync('./models/enum_submission_type.sql', 'utf8');
var enumTestType = fs.readFileSync('./models/enum_test_type.sql', 'utf8');
var courses = fs.readFileSync('./models/courses.sql', 'utf8');
var semesters = fs.readFileSync('./models/semesters.sql', 'utf8');
var courseInstances = fs.readFileSync('./models/course_instances.sql', 'utf8');
var topics = fs.readFileSync('./models/topics.sql', 'utf8');
var questions = fs.readFileSync('./models/questions.sql', 'utf8');
var testSets = fs.readFileSync('./models/test_sets.sql', 'utf8');
var tests = fs.readFileSync('./models/tests.sql', 'utf8');
var zones = fs.readFileSync('./models/zones.sql', 'utf8');
var accessRules = fs.readFileSync('./models/access_rules.sql', 'utf8');
var testQuestions = fs.readFileSync('./models/test_questions.sql', 'utf8');
var users = fs.readFileSync('./models/users.sql', 'utf8');
var enrollments = fs.readFileSync('./models/enrollments.sql', 'utf8');
var testInstances = fs.readFileSync('./models/test_instances.sql', 'utf8');
var testStates = fs.readFileSync('./models/test_states.sql', 'utf8');
var testScores = fs.readFileSync('./models/test_scores.sql', 'utf8');
var questionInstances = fs.readFileSync('./models/question_instances.sql', 'utf8');
var accesses = fs.readFileSync('./models/accesses.sql', 'utf8');
var questionViews = fs.readFileSync('./models/question_views.sql', 'utf8');
var submissions = fs.readFileSync('./models/submissions.sql', 'utf8');
var gradings = fs.readFileSync('./models/gradings.sql', 'utf8');
var questionScores = fs.readFileSync('./models/question_scores.sql', 'utf8');

var histogram = fs.readFileSync('./sprocs/histogram.sql', 'utf8');
var arrayHistogram = fs.readFileSync('./sprocs/array_histogram.sql', 'utf8');
var formatInterval = fs.readFileSync('./sprocs/format_interval.sql', 'utf8');
var formatIntervalShort = fs.readFileSync('./sprocs/format_interval_short.sql', 'utf8');
var intervalHistThresholds = fs.readFileSync('./sprocs/interval_hist_thresholds.sql', 'utf8');
var checkAccessRule = fs.readFileSync('./sprocs/check_access_rule.sql', 'utf8');
var checkTestAccess = fs.readFileSync('./sprocs/check_test_access.sql', 'utf8');
var testInstanceDurations = fs.readFileSync('./sprocs/test_instance_durations.sql', 'utf8');
var userTestDurations = fs.readFileSync('./sprocs/user_test_durations.sql', 'utf8');
var testDurationStats = fs.readFileSync('./sprocs/test_duration_stats.sql', 'utf8');
var userTestScores = fs.readFileSync('./sprocs/user_test_scores.sql', 'utf8');
var studentTestScores = fs.readFileSync('./sprocs/student_test_scores.sql', 'utf8');
var testStats = fs.readFileSync('./sprocs/test_stats.sql', 'utf8');

module.exports = {
    init: function(callback) {
        var that = module.exports;
        async.eachSeries([
            // models
            enumMode,
            enumQuestionType,
            enumRole,
            enumSubmissionType,
            enumTestType,
            courses,
            semesters,
            courseInstances,
            topics,
            questions,
            testSets,
            tests,
            zones,
            accessRules,
            testQuestions,
            users,
            enrollments,
            testInstances,
            testStates,
            testScores,
            questionInstances,
            accesses,
            questionViews,
            submissions,
            gradings,
            questionScores,

            // sprocs
            histogram,
            arrayHistogram,
            formatInterval,
            formatIntervalShort,
            intervalHistThresholds,
            checkAccessRule,
            checkTestAccess,
            testInstanceDurations,
            userTestDurations,
            testDurationStats,
            userTestScores,
            studentTestScores,
            testStats,
        ], function(sql, callback) {
            that.query(sql, [], callback);
        }, function(err) {
            callback(err);
        });
    },

    query: function(sql, params, callback) {
        pg.connect(config.sdbAddress, function(err, client, done) {
            var handleError = function(err) {
                if (!err) return false;
                if (client) {
                    done(client);
                }
                callback({sql: sql, params: params, err: err});
                return true;
            };
            if (handleError(err)) return;
            client.query(sql, params, function(err, result) {
                if (handleError(err)) return;
                done();
                callback(null, result);
            });
        });
    },
};
