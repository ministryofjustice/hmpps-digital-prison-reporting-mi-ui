Feature: Login
  Scenario: Unauthenticated user is redirected to auth
    When I navigate to the home page
    Then I am redirected to the login page

  Scenario: Unauthenticated user navigating to sign in page directed to auth
    When I navigate to the sign-in page
    Then I am redirected to the login page

  Scenario: Unauthenticated user navigating to reports page is redirected to auth
    When I navigate to the reports page
    Then I am redirected to the login page

  Scenario: Signing-in with invalid credentials causes a message to be displayed
    Given I navigate to the sign-in page
    When I attempt to log in with invalid credentials
    Then the message "Enter a valid username and password" is displayed

  Scenario: User signing-in with valid credentials is redirected to the main page
    Given I navigate to the home page
    When I log in with valid credentials
    Then I am redirected to the home page
