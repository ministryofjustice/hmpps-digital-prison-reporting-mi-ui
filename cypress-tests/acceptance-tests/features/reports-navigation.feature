Feature: Reports navigation
  Background:
    Given I navigate to the home page
    And I log in with valid credentials

  Scenario: Cards are displayed for each report
    When I navigate to the Reports page
    Then a card is displayed for each report

  Scenario: Cards are displayed for each variant
    Given I navigate to the Reports page
    When I click on a report card
    Then a card is displayed for each variant

  Scenario: Clicking variant card displays list page
    Given I navigate to the Reports page
    When I click on a report card
    And I click on a variant card
    Then I arrive on the list page

  Scenario: The report page has a breadcrumb back to the home page
    When I navigate to the Reports page
    Then a breadcrumb link is shown for the Home page
    And a breadcrumb with no link is shown for the Reports page

  Scenario: The variant page has a breadcrumb back to the home and Reports pages
    Given I navigate to the Reports page
    When I click on a report card
    Then a breadcrumb link is shown for the Home page
    And a breadcrumb link is shown for the Reports page
    And a breadcrumb with no link is shown for the Variants page

  Scenario: A list page has a breadcrumb back to the home, reports, and variant pages
    Given I navigate to the Reports page
    When I click on a report card
    And I click on a variant card
    Then a breadcrumb link is shown for the Home page
    And a breadcrumb link is shown for the Reports page
    And a breadcrumb link is shown for the Variants page
    And a breadcrumb with no link is shown for the List page

  Scenario: Default filters are applied to variant URL