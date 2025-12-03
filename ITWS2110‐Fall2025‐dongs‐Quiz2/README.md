# 3.1. Any design decisions that you took in completing this quiz.
There wasn't much since I was more focused on getting the database to work. I did think that the white was to boring
so I tried to add some color with the blue but it is still very plain. I was in a rush at the end so the index.php file
doesn't have styling. If we could have changed the organization of the site I wouldn't have it since after you click onto either page you cant access that page again since the navigation is directly built into the other pages.
# 3.2. Describe how you would handle a situation where a user came to the site for the very first time and no database existed (Think install)
If the issue is that there is no database I could send a message to the user and ask them to create a database by having a php page that has the code to create the database and make the tables. The user would only need to fill it out to sert up the database instead of doing all the steps from terminal.
# 3.3. How could you add functionality to prevent duplicate entries for the same project?
I would probably have the code check the project page to see if everything about the two projects are the same. It is possible to have projects be named the same, but having the developers and description the sme would make it obvious that the projects is a duplicate.
# 3.4. Suppose you want to include functionality to let people vote on the final in-class project presentations.
# 3.4.1. What additional table(s) will you include to support this?
I would add in a table called final class projects that would have every project listed, a table for all the students in the class, and a table for rankings.
# 3.4.2. How will you structure the data in these table(s)?
The projects would be organized the same as the current project file, same with the students. The only one different would be rankings table. The table would have students and projects included as foreign keys but the rankings of the projects would unique to the table.
# 3.4.3. How could you add functionality to prevent users from submitting a vote to their own project?
Assuming I already have the data of who was in each project team I would make sure to filter out any project that has their name in it. If it isnt provided as a option it is unlikely for someone to vote on it.