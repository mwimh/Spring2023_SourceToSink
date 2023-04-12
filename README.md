# From Source to Sink: Following the Flow of Water from Origin to Faucet

### Team Members

* Mallory Johnson
* Drew ten Bensel
* Alex Larson
* Michael Imhoff

### Final Proposal
1. ***Persona/Scenarios***
    1. **Persona**
    - Target User Profile: Kathy Jones, Conservation Planner - Dane County, WI
    User Background: Kathy is a conservation planner with Dane County, Wisconsin. She is concerned that urban sprawl may eventually put a strain on local water supplies. Since much of Wisconsin’s population relies on groundwater for drinking water and other purposes, aquifers and groundwater supply are important factors when planning municipal water systems. She would like to identify and delineate aquifers and watersheds that are the sources for specific addresses and hypothetical areas of suburban expansion. This would allow her to compare and rank aquifers/watersheds that are heavily accessed and identify areas that she may need to include in future groundwater modeling projects.
        Kathy also owns an acreage south of Madison along a small creek. This acreage has a private well that supplies water for Kathy’s family. She has noticed that after some rain events, water levels in the creek rise and sediment is present in water from her well.  Her neighbor’s well, 3000 feet to the west does not experience increased sediment after rain events. She would like to identify which aquifer and which surface watershed are connected to her well so she can understand what causes this phenomenon.

    2. **Scenarios**
        - Scenario 1: The user is a private well owner that knows the location of their private domestic well. Upon entering the interactive they are asked to either enter an address or select a point on the map. In this case the user selects the option to select a point on the map, and essentially drops a pin. By doing this, they are identifying their point of interest and retrieving aquifer and watershed information related to the well. They will also be able to overlay different features (watershed, surface water, aquifer) via a checklist of available layers on interactive. In this case, if the user wants to use the interactive for further exploration, they would be able to click a button to “view all” watersheds/aquifers. They can then hover over a polygon feature and retrieve watershed information of the feature.
        - Scenario 2: The user is a resident of Madison within city limits and on municipal water. Upon entering the page they enter their home address into the location search. A geocoder will link their address to a location within the city of Madison and display the municipal wells linked to the Madison municipal water system (and subsequently retrieve watershed info for that location). They would also be able to input a relative’s address who has a private well (independent of municipal system) and identify and delineate the watershed/aquifers of interest.

2. ***Requirements Document***
    - **Representations**
        - **Basemap**- us map/nation map w/ state boundaries, needs to have Wisconsin be main subject- nat earth/widnr

        - **Surface Watersheds**- HUC 8, 10, and 12 watershed boundaries and the areas they cover- widnr gis portal

        - **Surface water**- river lines and lake polygons showing surface water- widnr gis portal

        - **Groundwater Watersheds**- watershed boundaries and the areas they cover- widnr gis portal

        - **Water management units**- outlines of water management units- widnr gis portal

        - **Municipal Boundaries**- outlines of major municipal areas- LTSB gis portal

        - **Municipal “Utilities”**- point data showing municipal wells, linked to boundaries- public service commission (WI)

        - **Legend**- legend showing which objects are represented by what color

        - **Overview**- text displayed for informational background and user information

    
    - **Interactions**
        - **Location search**- Search: Location; Overlay: Objects. Find a point and present the watershed boundaries it is within

        - **Watershed hover**- Retrieve: Objects. Hover over a watershed to highlight boundary, popup with 

        - **Watershed selection**- Retrieve: Objects. Click on displayed watershed to display text box that gives information about the watershed, either ground or surface

        - **Surface water hover**- Retrieve: Objects. Hover over a surface water feature to show popup that displays what feature is.

        - **Water management unit hover**- Retrieve: Objects. Hover on a water management boundary for popup showing name of unit

        - **Overlay filter**- Filter: Objects; Overlay: Objects. Menu selection to toggle what layers are displayed, ability to change map objects


3. ***Wireframes***

    - Available in the 'img' folder





