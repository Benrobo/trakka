# TRAKKA

> Built during 48hrs hackathon.

The one and only app you would ever need to stay motivated while a high school `Students`. As college students who are currently learning remotely, the inspiration of this project came naturally since it directly related to me and have prompted me to create an app that we as `Students` currently believe would genuinely benefit the student population. 

Our application’s name, `Trakka`, draws inspiration from the remote learning that has become widely used over the past two years (from the term “off site”) as well as the ability we hope to give our users of easily obtaining an otherwise strenuous sense of organization (as they don’t need to spend a long time looking for documents).


![app.png](https://github.com/Benrobo/trakka/blob/main/readme-img/8.png?raw=true)

![app.png](https://github.com/Benrobo/trakka/blob/main/readme-img/9.png?raw=true)

![app.png](https://github.com/Benrobo/trakka/blob/main/readme-img/2.png?raw=true)

![app.png](https://github.com/Benrobo/trakka/blob/main/readme-img/3.png?raw=true)

![app.png](https://github.com/Benrobo/trakka/blob/main/readme-img/4.png?raw=true)

![app.png](https://github.com/Benrobo/trakka/blob/main/readme-img/5.png?raw=true)

![app.png](https://github.com/Benrobo/trakka/blob/main/readme-img/6.png?raw=true)

![app.png](https://github.com/Benrobo/trakka/blob/main/readme-img/1.png?raw=true)


# What it does

Trakka is an application that provides two services we find to be essential in the next wave of educational apps. One is a `to-do list` that actually draws attention from the user. Throughout our years of using many educational services, I have found that there is rarely a spotlight on arguably the most important function of an educational application: the `to-do list`. Even when you find it, it’s not easy to see clearly when a particular tasks has been completed. Trakka not only provides an interface that highlights this `to-do list`, but also pulls attention to our unique countdown due date on top displaying the usual calendar date. In addition, `Trakka` provides an intuitive interface which allows `Students` or `Teacher` track when a particular `Course` or `Exams` are due. It displays a count down timer which shows the `Registered` user when a specific added course or exam time table is at due. Increasing the awareness of student drastically.

# How I built it.

Trakka is divided into two section. one which is `Fontend` and second is `Backend`. The frontend was built using `Reactjs` using the `Create-react-app` command. It also relies on other libraries for smooth running. On the backend side of things, it was purely built using `Nodejs`, `Expressjs` which enable the `Trakka` much scalable. Communication of the frontend and backend where done using the `API` I designed which could make this possible. `Authentication` was done using `JsonWebToken`.

>No third party OAuth were used for the authentication.

Trakka, also enables storing of vital users informations, this is made possible using `postgresql`, `Prisma ORM` along with `CockcroachDB` making storing of information much flexible. 

# Challenges we ran into

Some challenges I ran into was  developing of this fully fledge application within `48hrs`. Also, had to learn some new technologies within this short period of time, technologies like `Prisma ORM` and `CockcroachDB` making development time much slower than before. Also, went through complex process of setting up `Auth0` which endedup been impossible due to the limited amount og time I had, this made me implement the user Authentication from scratch using the technologies mentioned above.

# Accomplishments that I'M proud

Apart from the time period been short, one of the thing am proud of is building this application within `2days` also learning of new technologies required for this application.

# What I learned.

I got the chance to dive more into topics such as ORM, schemas, Database Security, and other javascript features. Was also able to explored and build some useful and reusable `Components` and `Algorithm`.


# What's next for Trakka.

I believe that Trakka has the potential to be beneficial to students of any kind as well as anyone who has tasks they need to get done. For the future of Trakka, I plan to add more features as well as build upon the existing features. Along with this, other improvements include design, simplicity, and accessibility to anyone anywhere.

