import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
//let tweetsDataStored = JSON.parse(localStorage.getItem("data"));
let tweetsDataStored = tweetsData;
document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.handle) {
    modalDeleteTweet(e.target.dataset.handle, e.target.dataset.erase);
  } else if (e.target.id === "answer-btn") {
    const tweetId = e.target.parentNode.id;
    handleAnswerBtnClick(tweetId);
  } else if (
    e.target.id === "modal-close-btn" ||
    e.target.id === "modal-cancel-btn"
  ) {
    document.getElementById("modal").style.display = "none";
  }
});

function modalDeleteTweet(handle, tweetID) {
  if (handle === "@Scrimba") {
    document.getElementById("modal").style.display = "block";
    deleteTweet(tweetID)
  }
}

function deleteTweet(tweetID){
      document
      .getElementById("modal-delete-btn")
      .addEventListener("click", function () {
        tweetsDataStored.forEach(function (tweet, index) {
          if (tweetID === tweet.uuid) {
            tweetsDataStored.splice(index, 1);
            document.getElementById("modal").style.display = "none";
            render();
          }
        });
      });
}

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsDataStored.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  storeDatatoLocalStorage();
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsDataStored.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
  storeDatatoLocalStorage();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsDataStored.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    storeDatatoLocalStorage();
    tweetInput.value = "";
  }
}

function handleAnswerBtnClick(tweetId) {
  const answerInput = document.getElementById(`answer-input-${tweetId}`);
  const answerBtn = document.getElementById("answer-btn");
  tweetsDataStored.forEach(function (tweet) {
    if (tweetId === tweet.uuid) {
      tweet.replies.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: answerInput.value,
      });
    }
  });
  storeDatatoLocalStorage();
  render();
  answerInput.value = "";
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsDataStored.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                    </div>
        </div>
</div>
`;
      });
    }

    repliesHtml += ` 
            <div class="tweet-reply">
                 <div class="tweet-inner">
                   <img src="images/scrimbalogo.png" class="profile-pic">
                    <div>
                        <p class="handle">@Scrimba</p>
                        <textarea placeholder="Tweet your answer" class="tweet-text answer" id="answer-input-${tweet.uuid}"></textarea>
                    </div>
                </div>
                <div class="aligh-right" id=${tweet.uuid}>
                    <button class="answer-btn" id="answer-btn">Answer</button>
               </div>     
            </div>`;

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash" 
                    data-erase="${tweet.uuid}" data-handle=${tweet.handle} ></i>
                    
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
      ${repliesHtml}
    </div>   
</div>
`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

function storeDatatoLocalStorage() {
  localStorage.setItem("data", JSON.stringify(tweetsDataStored));
}


render();



