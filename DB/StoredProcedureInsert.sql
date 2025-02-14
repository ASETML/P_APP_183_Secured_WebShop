DELIMITER // 
CREATE PROCEDURE INSERT_USER(IN useusername VARCHAR(50), IN usepassword VARCHAR(64), IN usesalt VARCHAR(16), OUT sucess BOOLEAN ) 
BEGIN 
  DECLARE userCount DECIMAL(10,2) DEFAULT 0;

    SELECT COUNT(username) 
    INTO userCount
    FROM t_users
    WHERE username = useusername;

    IF userCount > 0 THEN
        SET sucess = FALSE;
    ELSE
    	SET sucess = TRUE;
        INSERT INTO t_users (username, password, salt) VALUES(useusername, usepassword, usesalt);
    END IF;
END // 
DELIMITER ;
