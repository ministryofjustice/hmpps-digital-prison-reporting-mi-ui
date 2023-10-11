Feature: List report
  Background:
    Given I navigate to the home page
    And I log in with valid credentials
    And I navigate to a list report

  Scenario: Filters are displayed
    Given the Show Filter button is displayed
    And the Filter panel is closed
    When I click the Show Filter button
    Then the Filter panel is open
    And filters are displayed for filterable fields

  Scenario: Data is displayed correctly
    When I navigate to a list report
    Then the column headers are displayed correctly
    And date times are displayed in the correct format
    And the correct data is displayed on the page

  Scenario: Filtering data displays correct results
    Given I click the Show Filter button
    When I select a filter
    And I apply the filters
    Then the selected filter value is displayed
    And the selected filter value is shown in the URL
    And the data is filtered correctly

  Scenario: Clicking a selected filter removes it
    Given I click the Show Filter button
    And I select a filter
    And I apply the filters
    When I click the selected filter
    Then no filters are selected

  Scenario: Clicking 'Clear all' removes all filters
    Given I click the Show Filter button
    And I select a filter
    And I apply the filters
    When I click a the Clear all button
    Then no filters are selected

  Scenario: Sorting on a previously unselected column
    When I select a column to sort on
    Then the sorted column is shown as sorted ascending in the header
    And the sorted column is shown in the URL
    And the ascending sort direction is shown in the URL

  Scenario: Sorting on a selected column
    When I select a previously selected column to sort on
    Then the sorted column is shown as sorted descending in the header
    And the sorted column is shown in the URL
    And the descending sort direction is shown in the URL

  Scenario: Changing page size
    When I select a page size of 10
    Then the page size is shown in the URL
    And the displayed data is not larger than the page size

  Scenario: Navigating paging
    When I click a paging link
    Then the current page is shown in the URL
