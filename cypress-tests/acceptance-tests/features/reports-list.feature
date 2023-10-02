Feature: Reports navigation
  Background:
    Given I navigate to the home page
    And I log in with valid credentials
    And I navigate to a list report

  Scenario: Filters are displayed
    Given the Show Filter button is displayed
    And the Filter panel is closed
    When I click the Show Filter button
    Then the Filter panel is open

  Scenario: Cards are displayed for each variant
    Given I navigate to the reports page
    When I click on a report card
    Then a card is displayed for each variant

  Scenario: Clicking variant card displays list page
    Given I navigate to the reports page
    When I click on a report card
    And I click on a variant card
    Then I arrive on the list page