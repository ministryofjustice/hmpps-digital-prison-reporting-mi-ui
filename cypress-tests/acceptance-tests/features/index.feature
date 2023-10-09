Feature: Index
  Background:
    Given I navigate to the home page
    And I log in with valid credentials

  Scenario: The Reports card is shown
    When I navigate to the home page
    Then the Reports card is displayed

  Scenario: Clicking the reports card takes me to the reports page
    Given I navigate to the home page
    When I click on the Reports card
    Then I arrive on the Reports page
