Feature: Reports navigation
  Background:
    Given I navigate to the home page
    And I log in with valid credentials

  Scenario: Clicking report link displays list page
    When I click on a report link
    Then I arrive on the request page

  Scenario: A list page has a breadcrumb back to the home page
    When I click on a report link
    Then a breadcrumb link is shown for the Home page
    And a breadcrumb link is shown for the request page
