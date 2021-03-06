(function(){
var app = angular.module('app', ['firebase']);

var tempQuestionList = [];
var tempID = "";
var tempIDList = [];
index = 0;    
var lclStorageID = "";


    app.controller('FirebaseController', function($scope){
        //FirebaseController responsible for sending data to Firebase

        $scope.submitData = function(courseID, question){
            lclStorageID = courseID;

            var ref = new Firebase("https://instantify.firebaseio.com");
            var active_question = ref.child(courseID);
            var answer = ref.child(courseID).child('answers');
            ref.once("value", function(snapshot) {
                var isChild = snapshot.hasChild(courseID);
                var q_Queue = ref.child(courseID).child('question_queue');
                var new_Question = q_Queue.push();
                
                if(isChild){
                    answer.set({'dummy_key' : 'XX'});
                    $("i[class*='fa-play-circle']").remove();
                    $(".questions i[class*='fa-check-square-o']").addClass('fa-square-o').removeClass('fa-check-square-o');
                    $('.body-view-question li').addClass('question');
                    $('.body-view-question li').removeAttr('id');
                    active_question.update({"active_question" : question});
                    new_Question.set(question);
                    
                }
                else{
                    var postID = new_Question.key();
                    var dataTable = ref.child(courseID);
                    var tempQuery = {};
                    tempQuery[postID] = question;
                    
                    dataTable.set({
                        active_question: question,
                        answers: {'testkey' : 'XX'},
                        history: {'testkey' : 'XX'},
                        question_queue: tempQuery
                    });
                }
            });
        }
    });   

    app.controller("LocalStorageController", function($scope){
        $scope.setID = function(courseID, question){
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem("id", courseID);
                localStorage.setItem("question", question);
            }
            else{ 
                document.getElementById("result").innerHTML = "Sorry, your browser does not support Web"
            }
        };        


        //Had problems setting a new controller in the html so just put this method here - sorry 'bout it!'
        $scope.isValid = function(courseID, question){

            if(courseID == undefined || question == undefined){
                console.log(courseID, question);
                console.log("false");
                return true;
            }
            
            else{
                console.log(courseID, question);
                console.log("true");
                // $(".button").attr("ng-show", "isValid()");   
                return false;
            } 
        }

        //Had problems setting a new controller in the html so just put this method here - sorry 'bout it!'
        $scope.isValid = function(data){
                console.log("validating");
            if(data == undefined){
                console.log(data);
                console.log("data undefined");
                return true;
            }
            
            else{
                console.log(data);
                console.log("validation success");
                return false;
            } 
        }
    });

    app.controller('MessageController', function($scope){
        this.msgID='ID';
        this.msgCreate='Create question';
        this.btnSubmit='Start';
        this.btnSave='Save';
        this.msgInput='Type question here';
    })

    app.controller('SaveController', function($scope, $firebaseArray){  

        $scope.saveData = function(courseID, question){

            tempID = courseID;
            var ref = new Firebase("https://instantify.firebaseio.com/");
            ref.once("value", function(snapshot) {
            var isChild = snapshot.hasChild(courseID);
            var q_Queue = ref.child(courseID).child('question_queue');
            var new_Question = q_Queue.push(); 
            var answer= ref.child(courseID).child('answers');

                if(isChild){
                    if ($('#active-chk').prop('checked') ){
                        $("i[class*='fa-play-circle']").remove();
                        $(".questions i[class*='fa-check-square-o']").addClass('fa-square-o').removeClass('fa-check-square-o');
                        $('.body-view-question li').addClass('question');
                        $('.body-view-question li').removeAttr('id');
                        answer.set({'dummy_key' : 'XX'});  
                        ref.child(courseID).update({'active_question' : question});
                        new_Question.set(question);
                    }
                    else{
                        
                        new_Question.set(question);
                    }
                }
                else{
                    var postID = new_Question.key();
                    var dataTable = ref.child(courseID);
                    var tempQuery = {};
                    tempQuery[postID] = question;
                    
                    dataTable.set({
                        active_question: question,
                        answers: {'testkey' : 'XX'},
                        history: {'testkey' : 'XX'},
                        question_queue: tempQuery
                    });
                }
            $('#verification').text('The question "' + question + '" has been added to ' + courseID).css({'color':'rgba(127,19,27,1)', 'position':'relative', 'top':'0px'});
            $('input[type=text]').val('');
            $('input[type=checkbox]').attr('checked',false);

           })
        }

        $scope.getListData = function(courseID){
            tempID = courseID;
            var firebaseRef = new Firebase("https://instantify.firebaseio.com/" + courseID);
            
            var active = firebaseRef.child('active_question');
            var ref = firebaseRef.child('question_queue');

            ref.on('child_added', function(snapshot) {
                active.once("value", function(data) {
                    active_question = data.val(); 
                    if(snapshot.val() == active_question){
                        $('.questions').prepend('<li id="active" data-value="' + snapshot.key() + '">' +  active_question + '</li></i><span class="icons"><a href="wordcloud.html" target="_blank"><i class="fa fa-play-circle fa-2x"></i></a><i class="fa fa-trash-o"></i><i class="fa fa-check-square-o"></i></span><hr>');
                    }
                    else{
                        $('.questions').prepend('<li class="question" id="delete" data-value="' + snapshot.key() + '">' +  snapshot.val() + '</li><span class="icons"><i class="fa fa-trash-o"></i><i class="fa fa-square-o"></i></span><hr>');
                    }
                });
            });
        };

    $(function(){
        $('#get-btn').on("click", function(event){
            $('#ID').val('');
            $('#ID').css({'display':'none'});
            $('#current-courseID').css({
                'display':'block'
                }).text(tempID);
            $('#change-courseID').css({'display':'block'});
            $('#get-btn').css({'display':'none'});
        });


        $('#change-courseID').on('click', function(){
            $('.body-view-question li').remove();
            $('.body-view-question span').remove();
            $('.body-view-question hr').remove();


            $('#ID').css({'display':'block'});
            $('#current-courseID').css({
                'display':'none'
            })
            $('#change-courseID').css({'display':'none'});
            $('#get-btn').css({'display':'block'});
            $('#ID').css({'display':'inline-block'});
            $('#ID').val('');
            $('.body-view-question p').css({'display':'none'})
            $('.body-view-question button').css({'display':'none'})
        })

    

        $('.body-view-question').on('click', '.fa-square-o', function(event){
            question = $(this).parent().prev().text();
            if ($(this).parent().prev().hasClass('question')){
                $('.body-view-question li').addClass('question');
                $('.body-view-question li').removeAttr('id');
                $(this).parent().prev().removeClass('question').attr('id','active');
                $('.questions a').remove();
                $("i[class*='fa-play-circle']").remove();
                $("i[class*='fa-check-square-o']").addClass('fa-square-o').removeClass('fa-check-square-o');
                //$('.questions').find('<i class="fa fa-check-square-o">').remove();
                $(this).parent().append('<a href="wordcloud.html" target="_blank"><i class="fa fa-play-circle fa-2x"></i></a>');
                $(this).parent().append('<i class="fa fa-check-square-o"></i>');
                $(this).remove();
                var ref = new Firebase("https://instantify.firebaseio.com/" + tempID);
                var answer= ref.child('answers');
                answer.set({'dummy_key' : 'XX'}); 
                ref.update({'active_question' : question});
            }
        })

        $('.questions').on('click', '.fa-trash-o', function(event){
            var data_value = $(this).parent().prev().data('value');
            if ($(this).parent().prev().attr('id') == 'active'){
                alert("Can't delete active question");
            }
            else{
                var deleteRef = new Firebase("https://instantify.firebaseio.com/" + tempID + "/question_queue/" + data_value);
                deleteRef.remove();

                $(this).parent().next().remove();
                $(this).parent().prev().remove();
                $(this).parent().remove();
                $(this).prev().remove();
            }
            
        })

        $('.body-view-question').on('click', '.fa-play-circle', function(event){
            var question = $(this).parent().parent().prev().text();
            var id = $('#current-courseID').text();
        
            localStorage.setItem('question', question);
            localStorage.setItem('id', id);        
        })

        $('.question-list').on('click', function(){
            localStorage.clear();
            $('#verification').empty();
            $('.header-question h2').text('View saved questions for an ID');
            $('nav div').removeClass('active');
            $(this).addClass('active');
            $('.box-view').css({'display':'block'})

            $('.box-add').css({'display':'none'})
            $('.box-new').css({'display':'none'})

            $('input[type=text]').val('');
        })

        $('.add-to-cloud').on('click', function(){
            localStorage.clear();
            $('#verification').empty();
            $('.header-question h2').text('Start a WordCloud instantly - just add a question');
            $('nav div').removeClass('active');
            $(this).addClass('active');
            $('.box-view').css({'display':'none'})
            $('.box-new').css({'display':'none'})
            $('.box-add').css({'display':'block'})

            $('input[type=text]').val('');
        })
        

        $('.add-question').on('click', function(){
            $('#verification').empty();
            $('.header-question h2').text('Save questions to ID');

            $('nav div').removeClass('active');
            $(this).addClass('active');
            $('.box-view').css({'display':'none'})
            $('.box-add').css({'display':'none'})
            $('.box-new').css({'display':'block'})

            $('input[type=text]').val('');
        })

        $('.btn').click(function(){
            $('input[type=text]').val('');
        })

    })
        

    }) 
})();