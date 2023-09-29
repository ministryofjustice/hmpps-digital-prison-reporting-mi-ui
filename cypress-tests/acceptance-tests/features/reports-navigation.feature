Feature: Index
  Background:
    Given I navigate to the home page
    And I log in with valid credentials

  Scenario: The Reports card is shown
    When I navigate to the reports page
    Then the data products are displayed
