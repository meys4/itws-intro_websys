CREATE DATABASE IF NOT EXISTS `websyslab8`;
USE `websyslab8`;

CREATE TABLE `courses` (
  `crn` int(11) PRIMARY KEY,
  `prefix` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` smallint(4) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `students` (
  `RIN` int(9) PRIMARY KEY,
  `RCSID` char(7),
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `alias` varchar(100) NOT NULL,
  `phone` int(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `grades` (
  `ID` int(11) PRIMARY KEY AUTO_INCREMENT,
  `CRN` int(11) NOT NULL,
  `RIN` int(9) NOT NULL,
  `grade` int(3) NOT NULL,
  FOREIGN KEY (`CRN`) REFERENCES `courses`(`crn`),
  FOREIGN KEY (`RIN`) REFERENCES `students`(`RIN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `courses`
  ADD `section` INT(4) NOT NULL,
  ADD `year` VARCHAR(6) NOT NULL;

ALTER TABLE `students`
  ADD `street` VARCHAR(255),
  ADD `city` VARCHAR(100),
  ADD `state` CHAR(2),
  ADD `zip` CHAR(10);

INSERT INTO `courses` (`crn`, `prefix`, `number`, `title`, `section`, `year`) VALUES
(35258, 'CSCI', 1200, 'Data Structures', 4, 2025),
(35492, 'CSCI', 2300, 'Introduction To Algorithms', 1, 2026),
(36138, 'ITWS', 4500, 'Web Science Systems Dev', 1, 2025),
(36412, 'MGMT', 2100, 'Statistical Methods', 2, 2025),
(38948, 'INQR', 1200, 'Principles Of Economics', 5, 2026),
(73048, 'ITWS', 2110, 'Web Systems Development', 1, 2026);

INSERT INTO `students` (`RIN`, `RCSID`, `first_name`, `last_name`, `alias`, `phone`, `street`, `city`, `state`, `zip`) VALUES
(661234567, 'barrett', 'Tracy', 'Barret', '', 1185551234, '42 Lorraine Street', 'Williamsburg', 'NY', '12203'),
(661234568, 'kellym', 'Maria', 'Kelly', '', 2103861500, '15 15th Street', 'Westminster', 'MD', '21157'),
(661234569, 'mills', 'Sarah', 'Mill', '', 1185553456, '100 First Street', 'Schenectady', 'NY', '12308'),
(661234570, 'cutlerb', 'Barbara', 'Cutler', 'Barb', 1234567890, '104 Rudolf Road', 'Saratoga', 'NY', '12866'),
(662034765, 'andrewd', 'David', 'Andrews', 'Andy', 1435501234, '144 Reese Rd', 'Finksburg', 'MD', '20134');

INSERT INTO `grades` (`ID`, `CRN`, `RIN`, `grade`) VALUES
(1, 73048, 661234567, 84),
(2, 73048, 661234568, 91),
(3, 73048, 661234569, 81),
(4, 73048, 661234570, 97),
(5, 36138, 661234567, 93),
(6, 36138, 661234568, 76),
(7, 36138, 661234569, 90),
(8, 36138, 661234570, 97),
(9, 35258, 661234567, 87),
(10, 35492, 661234568, 94),
(11, 35492, 661234569, 96),
(12, 36412, 662034765, 98);

-- List all students in the following sequences; in lexicographical order by RIN, last name, RCSID, and first name. Remember that lexicographical order is determined by your collation.
SELECT * FROM `students` ORDER BY `RIN` ASC;
SELECT * FROM `students` ORDER BY `RCSID` ASC;
SELECT * FROM `students` ORDER BY `last_name` ASC;
SELECT * FROM `students` ORDER BY `first_name` ASC;

-- List all students RIN, name, and address if their grade in any course was higher than a 90
SELECT
  s.RIN, s.first_name, s.last_name, s.street, s.city, s.state, s.zip
FROM websyslab8.students s
JOIN websyslab8.grades g ON s.RIN = g.RIN
WHERE g.grade > 90
GROUP BY s.RIN, s.first_name, s.last_name, s.street, s.city, s.state, s.zip
ORDER BY s.RIN;

-- List out the average grade in each course
SELECT
  c.crn, c.prefix, c.number, c.title,
  AVG(g.grade) AS average_grade
FROM websyslab8.courses c
JOIN websyslab8.grades g ON c.crn = g.CRN
GROUP BY c.crn, c.prefix, c.number, c.title
ORDER BY c.crn;

-- List out the number of students in each course
SELECT
  c.crn, c.prefix, c.number, c.title,
  COUNT(DISTINCT g.RIN) AS student_count
FROM websyslab8.courses c
LEFT JOIN websyslab8.grades g ON c.crn = g.CRN
GROUP BY c.crn, c.prefix, c.number, c.title
ORDER BY c.crn;
--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`CRN`) REFERENCES `courses` (`crn`),
  ADD CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`RIN`) REFERENCES `students` (`RIN`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
