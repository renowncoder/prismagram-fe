### 해결해야 하는 문제

- # 5.8 AuthContainer.js, localLogInMutation 뮤테이션 요청 시 워닝 발생

### # 4.0 CRA Cleanup and Installation

> npx create-react-app prismagram-fe

- 깃헙 레포 만들어서 remote 연결
- cleanup
- src/Components/App.js

> yarn add styled-components react-router-dom react-apollo-hooks graphql apollo-boost react-helmet

- yarn start, 에러 없는지 확인

### # 4.1 GlobalStyles and Theme

> yarn add react-toastify styled-reset

- src/Styles/
  - GlobalStyles.js
  - Theme.js
    - 글로벌 color, size 상수
  - App.js import
    - GlobalStyles.js
    - Theme.js

### # 4.2 React Router

- src/Routes/
  - Auth.js
  - Feed.js
  - Explore.js
  - Profile.js
  - Post.js
  - EditProfile.js
- src/Componets/Router.js
  - HashRouter, Router, Switch
- App.js 에서 import Router

### # 4.3 Apollo Client

- src/Apollo/Client.js
  - ApolloClient
  - uri 설정만 해주니까 docs 까지 다 들어감! Awesome!
- App.js
  - ApolloProvider
- src/Apollo/LocalState.js
  - 이번 프로젝트에 필요한 로컬 스테이트는 로그인했는지/안했는지
  - 리덕스를 대신해서 쓰기도 하는데, 우리는 그런 용도로 사용 X
  - defaults
    - isLoggedIn
  - resolvers
    - Mutation(localStorage 사용)
      - logUserIn
      - logUserOut

### # 4.4 First Hooks Query

- App.js
  - Query for isLoggedIn, gql
  - useQuery로 isLoggedIn 값 가져와서 AppRouter props로 넣어주기
  - GlobalStyles.js 업데이트

#### 실행결과

![](https://imgur.com/dEOCziU.gif)

### # 5.0 Auth Route UI pt.1

- Auth.js
  - useState, action, "logIn"
  - log In / Sign Up

### # 5.1 Footer and Auth Route UI pt.2

- Components/Footer.js
  - new Date().getFullYear()

### # 5.2 Footer and Auth Route UI pt.3

- Components/
  - Button.js
  - Input.js

### # 5.3 Auth Form with Hooks

- src/Hooks/
  - useInput.js
- Auth.js
  - username
  - firstName
  - lastName
  - email
  - password
- Input.js
  - value, onChange 매핑
  - type

#### 실행결과

![](https://imgur.com/lQdchRD.gif)

### # 5.4 requestSecret Mutation and Refactor

- Auth.js 를 container-presenter 패턴으로 변경: 크기가 커서
- Routes/Auth
  - AuthPresenter.js
    - onSubmit,
  - AuthContainer.js
    - onLogin
    - useMutation, requestSecret
  - AuthQueries.js
    - 하늘색 Log in 버튼을 클릭하면 secret 값을 담은 이메일이 날아가도록
    - LOG_IN
    - requestSecret
  - index.js
  - password 필드가 모델에 존재하지 않기 때문에, password 인풋 컴포넌트 주석처리

#### 실행결과

![](https://imgur.com/svWtTD4.jpg)

### # 5.5 Toastify and createAccount Mutation

> yarn add react-toastify

- 로그인 등의 이벤트가 발생했을 때 화면에서 알림을 띄워주는 기능
- App.js
  - react-toastify 설정
- AuthContainer.js
  - useMutation
    - update, 뮤테이션 요청이 처리된 이후, 서버로부터 응답을 받아서 다음 작업을 진행할 수 있는 로직
    - email 입력 후 log In 버튼을 누르면 requestSecret 뮤테이션 요청이 서버로 날아가고
      - 해당 이메일이 가입된 사용자의 이메일이라면, requestSecret 값을 true로 하여 반환하고, loginSecret 값을 메일로 보낸다.
      - 아니라면, requestSecret 값을 false로 하여 반환하고, toastify로 에러를 띄우고, 3초 후 signUp 페이지로 이동시킨다. (setAction)
  ### 백엔드 수정
  - createAccount 뮤테이션 결과로 User 가 아니라 boolean 반환토록 한다.
- AuthQueries.js
  - CREATE_ACCOOUNT
  - 뮤테이션 요청(gql 안에서)할 때에는 반환 필드를 설정하지 않음.
- AuthContainer.js
  - createAccount, useMutation
- AuthContainer.js, AuthPresenter.js
  - onLogin => onSubmit 변경
    - Log In, Sign Up 모두에서 사용하기 위해서
    - 각 과정에서 필요한 필드가 채워쳐 있는지 확인하고,
    - 모두 채워져 있다면, Log In -> requestSecret, Sign Up -> createAccount 뮤테이션 요청

### # 5.6 createAccount Mutation pt.2

- AuthContainer.js
  - requestSecret, createAccount
    - try - catch 에러 처리
    - async ~ await
  - useMutation, update 로직은 캐시 처리를 해줄 때 보통 사용한다.
    - 우리는 캐시 처리를 하는 것은 아니기 때문에 update 로직을 onSubmit 로직에 넣어준다. onSubmit 이후에도 서버 결과를 받을 수 있기 때문
  - createAccount 과정이 끝나고 true 값을 반환하면,
    - 반환 값은 서버 측 api 함수 이름, gql 내부 이름과 동일하게 들어간다.
    - logIn 페이지로 이동
  ### 백엔드 수정
  - createAccount
    - username, email 유효성 검사

#### 실행결과

![가입된 이메일로 로그인 요청 시](https://imgur.com/kVcxx3L.gif)
![가입되지 않은 이메일로 로그인 요청 시](https://imgur.com/V2uoNUe.gif)
![가입되지 않은 이메일로 가입 요청 시](https://imgur.com/Wliwk0c.gif)
![가입된 이메일로 가입 요청 시](https://imgur.com/AJAmaIT.gif)

### # 5.7 createAccount Mutation pt.3

- AuthContainer.js
  - secret, useInput
  - action 종류, logIn, signUp, confirm
  - loginSecret이 성공적으로 이메일로 보내졌을 때 action 값을 confirm으로 변경
- AuthPresenter.js
  - email을 넣고 로그인 요청 시 secret 을 입력할 수 있는 페이지 만들기
  - action이 cofirm 일 때

#### 실행결과

![로그인 요청 시 시크릿 입력 페이지로 전환](https://imgur.com/PaCVMkU.gif)

### # 5.8 cofirmSecret + Log In Mutation

- AuthPresenter.js
  - confirm 페이지에서는 StateChanger 컴포넌트 안보이도록
- AuthContainer.js
  - confirmSecretMutation, 서버에서 token 받아오기
  - onSubmit
    - action === 'confirm'
    - localLogInMutation
- AuthQueries.js
  - CONFIRM_SECRET
  - \_LOG_IN, @client
    - logUserIn, 로컬 resolver,

### # 6.0 Header UI

- Components
  - Header.js
  - Icon.js
    - 웹사이트, iconmonstr

### # 6.1 Header Logic pt.1

- Routes.js
  - Routes/ 이하 컴포넌트는 DIY
    - Explore.js -> /explore
    - Search.js -> /search
      - search 인풋 박스에서 엔터로 검색 시 search 페이지로 이동
      - form, onSubmit, 인풋 박스 엔터 먹는다.
      - Header.js
        - withRouter
        - history.push
    - Profile.js -> /:username
  - 라우팅을 위해서 explore, search가 profile보다 위에 정의되어야 한다.
    - explore도 :username으로 인식될 수 있다.

#### 실행결과

![검색박스에서 검색 시 url 변경](https://imgur.com/57Vqn5N.gif)

### # 6.2 Header Logic pt.2

- token이 로컬 스토리지에 들어가 있고, 로컬 스토리지를 읽어서 로컬 스테이트를 업데이트하여 인증 여부를 확인해서 UI를 뿌려주는데는 문제가 없다.
- API 요청을 날릴 때 (검색 박스에서 검색어를 치고 엔터!)는 token과 함께 요청을 날리는 것이 아니기 때문에 요청이 처리되지 않는 상황이다.
- Client.js
  - apollo-boost
    - headers / request 옵션을 이용
    - komachine 문의에서는 same-origin 이니까 credential 사용가능?
- Header 렌더링 시 ME 쿼리 요청을 날려서 username 을 가져온다.
  - HeaderLink의 profile에 사용자의 username 을 넣어준다.

#### 실행결과

![헤더를 렌더링하면서 me 쿼리 요청을 보낸 후 결과로 username을 가져와서 profile 메뉴의 link에 넣어준다](https://imgur.com/OXnH43F.gif)

### # 7.0 Getting the Feed and Loader Component

- Feed.js
  - FEED_QUERY 쿼리
  - useQuery
- Components/Loader.js

#### 실행결과

![피드를 가져오는 요청 중 Loader 렌더링](https://imgur.com/WXE93jg.gif)

### # 7.1 Post Component pt.1

- Feed.js
  - seeFeed 결과 data가 있는 경우 [Post!]!
- Components/Post/

  - index.js
  - PostContainer.js
    - propTypes 정의
  - PostPresenter.js

### # 7.2 Post Component pt.2

![isLiked, likeCount 업데이트](https://imgur.com/9YeDyZB.gif)

- PostContainer.js
  - 좋아요 기능
    - 유저 인터렉션을 빠르게 반영하기 위해서 서버에 업데이트 요청을 보내고 그 결과를 가져와서 보여주는 것이 아니라
    - 프론트엔드에서 스테이트로 관리하여 업데이트를 서버를 거치지 않고 바로 반영한다.
    - isLikedS, setIsLiked
    - likeCountS, setLikeCount
    - comment, useInput, 서버에서 받은 comments가 아니라 new comment 의미,
- Components/
  - Avatar.js
  - FatText.js
- react-helmet 적용
  - AuthPresenter.js
  - Feed.js

### # 7.3 Post Component pt.3

> yarn add react-autosize-textarea

- textarea css 리셋 어트리뷰트
  ```css
  border: none;
  resize: none;
  &:focus {
    outline: none;
  }
  ```
- 포스트 이미지가 여러 개 일 때 슬라이더 기능
  - 이미지 사이즈가 다 제 각각인 점 고려해야함(img 태그보단, background-image css가 편한 듯?)
  - PostContainer.js
    - currentItem, setCurrentItem
    - slide()
      - 3초 마다 이미지(정확히 말하면 이미지의 인덱스)를 변경해준다.
      - 마지막 이미지에 닿으면, 0번 인덱스로 돌아온다.
    - useEffect, componentDidMount의 역할 수행, 두 번째로 전달하는 파라미터를 보고 있다가 해당 파라미터의 값이 변경되면 다시 수행
      - 최초에 slide() 실행
      - slide()에 의해서 currentItem 값이 변경되면,
      - 다시 slide() 실행
    - useEffect + setTimeout 조합 vs. useEffect + setInterval 조합
      - useEffect 로직에서 변화를 감지하기 때문에, setInterval을 주면 오동작함.

#### 실행결과

![](https://imgur.com/VLHMubv.gif)

### # 7.4 toggleLike on Post Component

- Post/PostQueries.js
  - TOGGLE_LIKE
  - CREATE_COMMENT
- Post/PostContainer.js
  - toggleLikeMutation
    - toggleLike
      - isLikedS 값 변경,
      - toggleLikeMutation 요청
      - likeCountS 값 변경
- Post/PostPresenter.js
  - Post 컴포넌트 css 업데이트
    - 좋아요(하트)를 연속적으로 클릭하면, 아래 like 개수랑, 생성시간이 드래그 선택 되는데, 이를 방지,
      - user-select: none;

#### 실행결과

![좋아요 기능](https://imgur.com/T1Czm2y.gif)

### # 7.5 createComment on Post Component pt.1

- PostPresenter.js
  - comment를 입력하는 textarea 에서 엔터를 입력하면 textarea 입력 창이 확장된다.
  - 엔터를 입력하면 submit 이 날아가도록 수정
  - onKeyUp(e), e.keyCode, 엔터는 13
  - createCommentMutation
  - 주의할 사항
    - 엔터 입력 시 row 추가되지 않도록
    - 엔터 입력으로 createComment 요청을 보내면 현재 textarea의 텍스트 제거하고 업데이트

### # 7.6 createComment on Post Component pt.2

- useInput 업데이트
  - comment 입력, 엔터 후 값 지우기 위해서
- PostContainer.js
  - onKeyPress()
    - 엔터 입력 시 row 추가 되지 않도록
  - 추가한 comment가 ui에서 보이도록
    - comments(서버에서 받은) / selfComments(아직 서버에 입력되진 않았지만 UI 인터렉션에 의해 생성된)
- PostPresenter.js
  - src/SharedQueries.js
    - ME
    - Header 컴포넌트에 적용
    - PostContainer.js 에 적용

#### 실행결과

![comment 추가](https://imgur.com/5dmuKo8.gif)

### # 8.0 Search Screen Queries

- 검색 대상
  - post(caption, location), username
  - searchUser, searchPost api
- Routes/Search/
  - index.js, ~Container.js, ~Presenter.js, ~Queries.js
  - withRouter, term(검색어)를 얻기 위해서
  - ~Queries.js
    - SEARCH
      - searchUser
        - avatar, username, isFollowing, isSelf
      - searchPost
        - files, likeCount
  - ~Container.js
    - useQuery, 검색어 없는 경우 skip 옵션

### # 8.1 Search Screen UI pt.1

- src/Components/UserCard.js

### # 8.2 Search Screen UI pt.2

- datamodel.prisma
  - type User
    - avatar에 @default(value: ~) 넣기

#### 실행결과

![](https://imgur.com/StgvsZX.jpg)

### # 8.3 Follow Button

- Components/FollowButton/
  - index.js
  - ~Container.js
    - followMutation
    - unfollowMutation
    - isFollowingS, setIsFollowing
    - onClick()
  - ~Presenter.js
  - ~Queries.js
    - FOLLOW
    - UNFOLLOW

#### 실행결과

![follow/unfollow 기능](https://imgur.com/IiTAJmg.gif)

### # 8.4 SquarePost Component

- ![검색 결과로 나온 포스트에 마우스 올렸을 때](https://imgur.com/4U7Uctc.gif)
- Components/SquarePost.js
  - likeCount, commentCount, file(첫번째 파일 이미지)
- ### 백엔드
  - Post 모델, commentCount
    - Post/Post.js
      - likeCount 카피해서 수정
    - models.graphql에 commentCount 추가

#### 실행결과

![](https://imgur.com/P8wW3GX.gif)

### # 9.0 Profile Screen pt.1

- Post/PostPresenter.js
  - username에 Link 연결
- Routes/Profile.js
  - ### 백엔드 seeUser.js, seeUser.graphql
    - id => username으로 수정
    - User.js, models.graphql
      - postsCount 추가
  - GET_USER
    - avatar, username, fullname, isSelf, bio, followingCount, followersCount, postsCount, posts(id, files-url, likeCount, commentCount)
  - withRouter, url에서 username을 읽어오기 위해서
    - match.params.username

### # 9.1 Profile Screen pt.2

- Routes/Profile.js 삭제
- Routes/Profile/
  - index.js
  - ~Container.js
  - ~Presenter.js
  - ~Queries.js

### # 9.2 Log Out and Conclusions

- Homework
  - Explore
  - show Full Post (Pop)
  - Edit profile
- Log Out
  - ProfileQueries.js
    - LOG_OUT
    - @client
  - ProfileContainer.js
    - logUserOutMutation, logOut
  - LocalState.js
    - 로그아웃 시 / 로 이동
    - window.location
  - Routes.js
    - 나머지 경로에 대해서 redirect (마지막에 위치 시켜야 함)

### # 19.0 Deploying Frontend to Netlify
