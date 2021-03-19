@topology
Feature: Add HPA action and topology sidebar modifications
              As a user, I want to add a HPA to a workload


        Background:
            Given user is at developer perspective
              And user has added CPU resource limit
              And user has added Memory resource limit


        @regression
        Scenario: Add HPA to deployment from action menu
            Given user is in topology
             When user opens sidebar of workload
              And user opens action menu
              And user clicks on Add Horizontal Pod Autoscaler option
              And user sees Add Horizontal Pod Autoscaler page opens with form view selected
              And user adds name "<hpa_name>"
              And user assigns minimum pods value to "<hpa_min_pod>"
              And user assigns maximum pods value to "<hpa_max_pod>"
              And user gives CPU Utilization value as "<cpu_utilisation>"
              And user gives Memory Utilization value as "<memory_utilization>"
              And user clicks on save to get back to topology page
              And user opens the sidebar
              And user selects on resource tab
             Then user can see two pods under pod section
              And user can see Horizontal Pod Autoscalers section
              And user can see the "<hpa_name>" with HPA tag associated present under HPA section

       
        @regression
        Scenario: Add HPA form
            Given user has created workload "nodejs-ex-git" with advanced scaling values
              And user is at Topology page
             When user clicks on the workload "nodejs-ex-git" to open the sidebar
              And user selects "Add HorizontalPodAutoscaler" option from Actions menu
             Then user is able to see Add HorizontalPodAutoscaler page form view
              And user can see name field
              And user can see minimum pods with increasing and decreasing button
              And user can see maximum pods with increasing and decreasing button
              And user can see CPU Utilization
              And user can see Memory Utilization
              And user can see save and cancel button

        @regression
        Scenario: Add HPA to deployment from context menu
            Given user is in topology
             When user right clicks on workload to open context menu
              And user clicks on Add Horizontal Pod Autoscaler option
              And user sees Add Horizontal Pod Autoscaler page opens with form view selected
              And user adds name "<hpa_name>"
              And user assigns minimum pods value to "<hpa_min_pod>"
              And user assigns maximum pods value to "<hpa_max_pod>"
              And user gives CPU Utilization value as "<cpu_utilisation>"
              And user gives Memory Utilization value as "<memory_utilization>"
              And user clicks on save to get back to topology page
              And user opens the sidebar
              And user selects on resource tab
             Then user can see two pods under pod section
              And user can see Horizontal Pod Autoscalers section
              And user can see the "<hpa_name>" with HPA tag associated present under HPA section

        Examples:
                  | workload_name   | hpa_max_pod | hpa_min_pod | cpu_utilisation | memory_utilization |
                  | nodejs-ex-git-1 | 6           | 3           | 75              | 50                 |


<<<<<<< Updated upstream
@regression @manual
=======
<<<<<<< Updated upstream
@regression, @manual
>>>>>>> Stashed changes
        Scenario: Add HPA from YAML view
            Given user is in topology
             When user opens sidebar of workload
              And user opens action menu
              And user clicks on Add Horizontal Pod Autoscaler option
              And user sees Add Horizontal Pod Autoscaler page opens with form view selected
=======
        @regression
        Scenario Outline: Add HPA to "<resource_type>" workload from action menu
            Given user has created workload "<workload_name>" with resource type "<resource_type>"
              And user is at Topology page
             When user clicks on the workload "nodejs-ex-git" to open the sidebar
              And user selects "Add HorizontalPodAutoscaler" option from Actions menu
              And user is able to see Add HorizontalPodAutoscaler page form view
              And user enters name as "<hpa_name>"
              And user assigns minimum pods value to "<hpa_min_pod>"
              And user assigns maximum pods value to "<hpa_max_pod>"
              And user gives CPU Utilization value as "<cpu_utilisation>"
              And user gives Memory Utilization value as "<memory_utilization>"
              And user clicks on save to get back to topology page
              And user opens the sidebar
              And user selects on resource tab
             Then user can see two pods under pod section
              And user can see Horizontal Pod Autoscalers section
              And user can see the "<hpa_name>" with HPA tag associated present under HPA section

        Examples:
                  | workload_name    | resource_type     | hpa_name | hpa_max_pod | hpa_min_pod | cpu_utilisation | memory_utilization |
                  | nodejs-ex-git-d  | Deployment        | test-hpa | 5           | 2           | 60              | 30                 |
                  | nodejs-ex-git-dc | Deployment Config | test-hpa | 5           | 2           | 60              | 30                 |


        @regression @manual
        Scenario: Add HPA from YAML view
            Given user has created workload "nodejs-ex-git" with advanced scaling values
              And user is at Topology page
             When user right clicks on the workload "nodejs-ex-git" to open the Context Menu
              And user selects "Add HorizontalPodAutoscaler" option from Actions menu
>>>>>>> Stashed changes
              And user selects YAML view option
              And user sees schema on the right sidebar
              And user scrolls and checks schema
              And user closes the schema
              And user checks the YAML
<<<<<<< Updated upstream
              And user assigns name value as "<hpa_name>"
              And user gives value to averageUtilization under cpu target as "<cpu_utilisation>"
              And user clicks on save to get back to topology page
              And user opens the sidebar
              And user selects on resource tab
             Then user can see Horizontal Pod Autoscalers section
              And user can see the "<hpa_name>" with HPA tag associated present under HPA section


        @regression
        Scenario Outline: Add HPA to "<resource_type>" workload from action menu
            Given user has created workload "<workload_name>" with resource type "<resource_type>"
              And user is at Topology page
             When user clicks on the workload "nodejs-ex-git" to open the sidebar
              And user selects "Add HorizontalPodAutoscaler" option from Actions menu
              And user is able to see Add HorizontalPodAutoscaler page form view
              And user enters name as "<hpa_name>"
              And user assigns minimum pods value to "<hpa_min_pod>"
              And user assigns maximum pods value to "<hpa_max_pod>"
              And user gives CPU Utilization value as "<cpu_utilisation>"
              And user gives Memory Utilization value as "<memory_utilization>"
              And user clicks on save to get back to topology page
              And user opens the sidebar
              And user selects on resource tab
             Then user can see two pods under pod section
              And user can see Horizontal Pod Autoscalers section
              And user can see the "<hpa_name>" with HPA tag associated present under HPA section

        Examples:
                  | workload_name    | resource_type     | hpa_name | hpa_max_pod | hpa_min_pod | cpu_utilisation | memory_utilization |
                  | nodejs-ex-git-d  | Deployment        | test-hpa | 5           | 2           | 60              | 30                 |
                  | nodejs-ex-git-dc | Deployment Config | test-hpa | 5           | 2           | 60              | 30                 |


        @regression @manual
        Scenario: Add HPA from YAML view
            Given user has created workload "nodejs-ex-git" with advanced scaling values
              And user is at Topology page
             When user right clicks on the workload "nodejs-ex-git" to open the Context Menu
              And user selects "Add HorizontalPodAutoscaler" option from Actions menu
              And user selects YAML view option
              And user sees schema on the right sidebar
              And user scrolls and checks schema
              And user closes the schema
              And user checks the YAML
              And user assigns name value as "example-test"
              And user gives value to averageUtilization under cpu target as "60"
              And user clicks on save
             Then user redirects to Topology page
              And user can see Horizontal Pod Autoscalers section under resources tab of workload "nodejs-ex-git" side bar
              And user can see the "example-test" with HPA icon under HPA section


        @regression @manual
        Scenario Outline: Add HPA from Administrative perspective
<<<<<<< Updated upstream
            Given user is at Topology page
=======
            Given user is in topology
=======
              And user assigns name value as "example-test"
              And user gives value to averageUtilization under cpu target as "60"
              And user clicks on save
             Then user redirects to Topology page
              And user can see Horizontal Pod Autoscalers section under resources tab of workload "nodejs-ex-git" side bar
              And user can see the "example-test" with HPA icon under HPA section


        @regression @manual
        Scenario Outline: Add HPA from Administrative perspective
            Given user is at Topology page
>>>>>>> Stashed changes
>>>>>>> Stashed changes
             When user switches to administrative perspective
              And user goes to Workloads
              And user selects Horizontal Pod Autoscalers option
              And user clicks Create Horizontal Pod Autoscaler button
              And user sees Create Horizontal Pod Autoscaler in YAML view
              And user sees schema on the right sidebar
              And user scrolls and checks schema
              And user closes the schema
              And user changes the metadata.name to "<name_hpa>"
              And user changes the spec.scaleTargetRef.name to "<workload_name>"
              And user changes the spec.minReplicas to "<min_hpa_pod>"
              And user changes the spec.maxReplicas to "<max_hpa_pod>"
              And user changes value to spec.metrics.resource.target.averageUtilization under cpu target as "<cpu_util>"
              And user adds new field for memory similar to cpu under spec.metrics as resource.name with value memory
              And user adds value for memory to spec.metrics.resource.target.averageUtilization under memory target as "<memory_util>"
              And user sees save, reload and cancel button
              And user clicks on save to get to Horizontal Pod Autoscalers Details
              And user checks details with Action menu on top
              And user sees Edit Labels, Edit Annotaions, Edit Horizontal Pod Autoscaler, Delete Horizontal Pod Autoscaler options in action menu
              And user checks details, YAML and Events tabs
              And user switches to developer perspective
              And user opens the sidebar of the "<workload_name>"
              And user selects on resource tab
             Then user can see Horizontal Pod Autoscalers section
              And user can see the "<name_hpa>" with HPA tag associated present under HPA section

        Examples:
                  | workload_name   | name_hpa | max_hpa_pod | min_hpa_pod | cpu_util | memory_util |
                  | nodejs-ex-git-1 | test-hpa | 5           | 2           | 60       | 30          |
