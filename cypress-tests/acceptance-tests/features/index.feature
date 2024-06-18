Feature: Index
  Background:
    Given I navigate to the home page
    And I log in with valid credentials

  Scenario: The Reports list is shown
    When I navigate to the home page
    Then the Reports list is displayed

  Scenario: Clicking the reports card takes me to the reports page
    Given I navigate to the home page
    When I click on a report link
    Then I arrive on the request page
