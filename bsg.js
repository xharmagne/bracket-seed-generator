$(document).ready(function() {
  $("#ChallongeData").focus(function() {
    $(this).select();
  });

  //$("#InputPlayerData").val("Genxa,NSW,1\r\nMPK | Hydeman,NSW,\r\ntoshin,NSW,\r\nGoodpart,NSW,2\r\nSaikyobatsujin,NSW,\r\nx5_FithAlucard,NSW,\r\nfkn.VittySMAYSH,VIC,\r\nMuttons,VIC,2\r\nFlying Dutchman,QLD,2\r\nManySpice,QLD,\r\nBurnoutFighter,VIC,1\r\nNick,NSW,\r\nMike Hawke,NSW,\r\n[~DTC~],NSW,\r\nFergus,NSW,\r\nCrook3d,NSW,\r\nDAILOU,NSW,1\r\nUNSWFGC | Stream Monsters,NSW,\r\nDario,VIC,\r\nUNSWFGC | Audacity,NSW,\r\nUNSWFGC | Victor,NSW,\r\nVlade,ACT,2\r\njaunty,NSW,2\r\nSpoony,VIC,\r\nPercadu,ACT,\r\nAlexK,NSW,2\r\ndustinabalos,NSW,\r\ndavidabalos,NSW,\r\nEJ | Aurelius,NSW,\r\nMadenka,NSW,\r\nOzz1m,NSW,\r\nGerry,NSW,\r\nFalco,SA,1\r\nTrickster Foxy,NSW,\r\nyangrrr,VIC,\r\nPNS_SHOGUN,ACT,2\r\nATB|CoolzHAMYOLO,WA,2\r\nYohei,NSW,1\r\nfkn.Rossco,VIC,\r\nfkn.P33M4N,QLD,\r\nLUVPERTHGC,NSW,\r\nnNinetailZz,QLD,\r\nBetterpart,NSW,\r\nx5_Baxter,QLD,2\r\nMarthicus,VIC,\r\nThinkovme,PNG,\r\nIce,PNG,\r\nRenzokuken,NSW,\r\nSpaceghost,NSW,1\r\nGoBack | Brownman,VIC,\r\nArnold Desu,NSW,1\r\nMohtar,NSW,\r\nbksama,NSW,2\r\nKenshine,NSW,\r\nmaxsze,NSW,\r\nNiah,NSW,2\r\nMooseking,SA,\r\nNO3SCAP3E,NSW,\r\nIf I Was King,NSW,1\r\nON | Colonov,QLD,1\r\nRobby Berape'nem,SA,\r\nAtomic,NSW,\r\nUNSWFGC | Ichijin,NSW,\r\ncrotchpuncha,NSW,\r\nKimpee,NSW,\r\nPrincess Harom,NSW,\r\nKYUUBI MODE au,NSW,2\r\nSalt King,NSW,\r\nLaozer,NSW,\r\nTony,NSW,\r\nPresto,NSW,2\r\nFKN KING,VIC,2\r\nSpasian,NSW,\r\nFangedbeast,NSW,\r\nRiskyBusiness,NSW,\r\n");
  //SeedPlayers('delimiter', 'default_region', 'min_pools', 'max_pool_size', 'region_seeding', 'region_prefix', 'InputPlayerData', 'RegionWarning', 'Output', 'Matchups', 'RegionCounts', 'SeedOrder', 'Alphabetical', 'ChallongeInfo', 'ChallongeData', 'Challonge');

});


// Reads player list and setting from the user.
// Seeds the bracket and returns the pools structure and region spread diagnostics if required.
// Calls a function to display the seeding results for review and manual entry into Challonge.
function SeedPlayers(id_delimiter, id_default_region, id_min_pools, id_max_pool_size, id_region_seeding,
                     id_region_prefix, id_InputPlayerData, id_RegionWarning, id_Output, id_Matchups, id_RegionCounts,
                     id_SeedOrder, id_Alphabetical, id_ChallongeInfo, id_ChallongeData, id_Challonge) {
   // ***** Declaring variables. *****
   // Arrays.
   var PlayerName = [];
   var PlayerRegion = [];
   var PlayerRank = [];
   var PlayerRegionID = [];
   var RegionList = [];
   var SeededRegions = [];
   var SeededPlayers = [];
   var RegionTotals = [];
   var OrderedRegionTotals = [];
   var SeedAddressGlobal = [];
   var SeedAddressesByPool = [];
   var SeedIDsPerPool = [];
   // Strings.
   var str_PlayerData = "";
   var str_styles = "";
   // Integers.
   var n_players = 0;
   var n_regions = 0;
   var MaxRank = 0;
   var MinRank = 30000;
   var r_players = 0;
   var rFirstSeed = 0;
   var rTotalPlayers = 0;
   var SortMultiplier = 1;
   var BracketLayers = 0;
   var BracketSize = 0;
   var nUnseeded = 0;
   var CurrentRegion = 0;
   var PrevExceptions = 0;
   var RedrawThreshhold = 0;
   var RedrawCount = 0;
   var Draw = 0;
   var Seed = 0;
   var ExceptionCount = 0;
   var n_pools = 0;
   var PoolSize = 0;
   var int_temp = 0;
   var i = 0;
   var j = 0;
   var k = 0;
   var r = 0;
   // Booleans.
   var bln_Found = false;
   var bln_Redraw = true;
   // ***** End declaring variables. *****

   // Reading in the various parameters from the html form elements.
   var delimiter = document.getElementById(id_delimiter).value;
   var default_region = document.getElementById(id_default_region).value;
   var min_pools = document.getElementById(id_min_pools).value;
   var max_pools_size = document.getElementById(id_max_pool_size).value;
   var bln_region_seeding = document.getElementById(id_region_seeding).checked;
   var bln_region_prefix = document.getElementById(id_region_prefix).checked;

   // Reading the player data from a text area.
   var TextboxData = document.getElementById(id_InputPlayerData).value;

   // Splitting the text data rows into an array via carriage returns.
   var DataArray = TextboxData.split('\n');

   // Stripping the last row in the array if it's empty.
   if (DataArray[DataArray.length - 1].trim() == ""){
      DataArray.pop();
   } // end if DataArray

   // Counting the number of players.
   n_players = DataArray.length;

   // Setting the tab delimiter character
   // Either tab or comma - guess based on contents of first line.
   delimiter = ",";
   if (DataArray[i].indexOf(delimiter) < 0) {
      delimiter = "\t";
   } // end if delimiter

   // Looping through the data and splitting it into three entries: Name, Region, Rank.
   for (i = 0; i < DataArray.length; i++) {
      str_PlayerData = DataArray[i].split(delimiter,3);
      PlayerName.push(str_PlayerData[0]);
      if (str_PlayerData.length > 1){
         PlayerRegion.push(str_PlayerData[1]);
      } else {
         PlayerRegion[i] = default_region;
      } // end if else
      if (str_PlayerData.length > 2){
         PlayerRank.push(str_PlayerData[2]);
      } else {
         PlayerRank.push("");
      } // end if else
      if (PlayerRank[i].trim() == ""){
         PlayerRank[i] = -1;
      } // end if PlayerRank[i]
      if (PlayerRegion[i].trim() == ""){
         PlayerRegion[i] = default_region;
      } // end if PlayerRegion[i]

      // Building the list of regions and assigning region codes to each player.
      bln_found = false;
      for (j = 0; j < n_regions; j++){
         if (PlayerRegion[i] == RegionList[j]){
            bln_found = true;
            PlayerRegionID.push(j);
         } // end if PlayerRegion[i]
      } // end for j
      if (bln_found == false){
         PlayerRegionID.push(n_regions);
         n_regions = n_regions + 1;
         RegionList.push(PlayerRegion[i]);
      } // end if bln_found
      // Updating the range for ranks.
      if (PlayerRank[i] > 0){
        if (PlayerRank[i] < MinRank){
           MinRank = parseInt(PlayerRank[i]);
        } // end if PlayerRank[i]
        if (PlayerRank[i] > MaxRank){
           MaxRank = parseInt(PlayerRank[i]);
        } // end if PlayerRank[i]
      } // end if PlayerRank[i]
   } // end for i

   // Setting any non-positive ranks to MaxRank + 1.
   for (i = 0; i < PlayerRank.length; i++){
      PlayerRank[i] = PlayerRank[i];
      if (PlayerRank[i] <= 0){
         PlayerRank[i] = MaxRank + 1;
      } // end if PlayerRank[i]
   } // end for i

   // Updating the minimum rank to be positive.
   if (MinRank <= 0){
         MinRank = 1;
   } // end if MinRank

   SeededRegions = InitialiseArray(n_players, 1, -1)
   SeededPlayers = InitialiseArray(n_players, 1, -1)

   // ***** Generating the random seeds. *****
   // Generating random seeds within each player rank in ascending order.
   for (r = MinRank; r <= (MaxRank + 1); r++){
      // Finding the total number of players for the current rank.
      rPlayers = 0;
      for (i = 0; i < n_players; i++){
         if (PlayerRank[i] == r){
            rPlayers = rPlayers + 1;
         } // end if PlayerRank[i]
      } // end for i
      // Only proceeds if there are any players to seed for the current rank.
      if (rPlayers > 0){
         // Total players in the current loop, including all players from previous ranks.
         // This is the range of bracket seeds to be filled by the current rank.
         rFirstSeed = rTotalPlayers + 1;
         rTotalPlayers = rTotalPlayers + rPlayers;

         // Finding the total number of players per region.
         RegionTotals = InitialiseArray(n_regions + 1, 1, 0);
         OrderedRegionTotals = InitialiseArray(n_regions + 1, 2, 0);

         for (i = 0; i < n_players; i++){
            if (PlayerRank[i] == r){
               j = PlayerRegionID[i];
               RegionTotals[j] = RegionTotals[j] + 1;
            } // end if PlayerRank[i]
         } // end for i

         // Sorting the regional totals from largest to smallest.
         // Sort order is reversed for the final rank.

         OrderedRegionTotals[n_regions][1] = RegionTotals[n_regions];
         for (i = 0; i < n_regions; i++){
            OrderedRegionTotals[i][0] = i;
            OrderedRegionTotals[i][1] = RegionTotals[i];
            for (j = (i - 1); j >= 0; j--){
               SortMultiplier = 1;
               if (r == (MaxRank + 1)){
                  SortMultiplier = -1;
               } // end if r

               if ((SortMultiplier * OrderedRegionTotals[j+1][1]) > (SortMultiplier * OrderedRegionTotals[j][1])) {
                  for (k = 0; k <= 1; k++){
                     int_temp = OrderedRegionTotals[j][k];
                     OrderedRegionTotals[j][k] = OrderedRegionTotals[j+1][k];
                     OrderedRegionTotals[j+1][k] = int_temp;
                  } // end for k
               } else {
                  j = 0;
               } // end if else
            } // end for j
         } // end for i

         // Finding the smallest elimination bracket that will hold the total number of players.
         BracketLayers = Math.ceil(Math.log2(rTotalPlayers));
         BracketSize = Math.pow(2, BracketLayers);

         // Setting up the pool of available seeds from which to draw.
         var RemainingSeeds = [];
         for (i = 0; i < rPlayers; i++){
            RemainingSeeds.push(rFirstSeed + i);
         } // end for i
         // Setting the total number of players to be seeded.
         nUnseeded = rPlayers;
         // Drawing seeds by region for each player.
         // Iterates through each region by size, starting with the largest.
         for (i = 0; i <= n_regions; i++){
            // Setting the current region.
            CurrentRegion = OrderedRegionTotals[i][0];

            if (OrderedRegionTotals[i][1] > 0){
               // Building the list of eligible player IDs for the current rank and region.
               var rPlayerIDs = [];
               k = 0;
               for (j = 0; j < n_players; j++){
                  if (PlayerRank[j] == r){
                     if(PlayerRegionID[j] == CurrentRegion){
                        k = k + 1;
                        rPlayerIDs.push(j);
                     } // end if PlayerRegionID
                  } // end if PlayerRank
               } // end for j
            } // end if OrderedRegionTotals[i][1]

            // Preparing the initial region counters across previous ranks.
            // Also counts any outstanding regional spread exceptions.

            RegionCounts = InitialiseArray(BracketSize, BracketLayers + 1, 0);

	    PrevExceptions = 0;
            if (r > MinRank){
               for (j = 0; j < rTotalPlayers; j++){
                  if (SeededRegions[j] == CurrentRegion){
                    // Updating the regional counters.
                    RegionCounts = UpdateRegionCounts(RegionCounts, BracketLayers, j, 1);
                  } // end if SeededRegions
               } // end for j
               // Checking the differences between the counters at each level.
               // If the differences between any 2 counters on the same level exceed 1 then
               // the regional spread is not optimal. This is stored for reference so that seedings
               // for this rank can try to improve the overall spread.
               PrevExceptions = PrevExceptions + CountExceptions(RegionCounts, BracketLayers);
            } // end if r
            // Disabling regional spread checks.
            if (bln_region_seeding == false){
               PrevExceptions = 0;
            } // end if bln_regional_seeding
            // Setting the redraw threshhold. If the total number of redraws exceeds this number
            // then redrawing will be disabled.
            // The probability of failing to draw any one of the available seeds is set to 1 x 10^(-7).
            if (nUnseeded > 1){
               RedrawThreshhold = Math.ceil(Math.log(0.0000001) / Math.log((nUnseeded-1)/nUnseeded));
            } else {
               RedrawThreshhold = 1;
            } // end if else
            RedrawCount = 0;
            // Looping through each player in the current region.
            for (j = 0; j < OrderedRegionTotals[i][1]; j++){
               bln_Redraw = true;

               // Redraw loop. this will repeat until the regional spread is acceptable or the redraw
               // threshhold has been reached.
               while (bln_Redraw == true){
                  // Counting the redraws.
                  RedrawCount = RedrawCount + 1;
                  // The random draw.
                  Draw = Math.floor(Math.random() * nUnseeded);
                  // Converting the draw into an eligible bracket seed.
                  Seed = RemainingSeeds[Draw] - 1;
                  // Updating the regional counters.
                  RegionCounts = UpdateRegionCounts(RegionCounts, BracketLayers, Seed, 1);

                  // Checking the differences between the counters at each level.
                  // If the differences between any 2 counters on the same level exceed 1 then
                  // the regional spread is not optimal.
                  ExceptionCount = CountExceptions(RegionCounts, BracketLayers);

                  // Disabling regional spread checks.
                  if (bln_region_seeding == false){
                     ExceptionCount = 0;
                  } // end if bln_regional_seeding
                  // Test for the RedrawThreshhold.
                  if (RedrawCount > RedrawThreshhold){
                     bln_Redraw = false;
                  } else {
                     if (PrevExceptions == 0){
                        if (ExceptionCount == 0){
                           bln_Redraw = false;
                        } // end if ExceptionCount
                     } else {
                        if (ExceptionCount < PrevExceptions){
                           PrevExceptions = ExceptionCount;
                           bln_Redraw = false;
                        } // end if ExceptionCount
                     }// end if else
                  }// end if else

                  // Winding back the counters and triggering a redraw.
                  if (bln_Redraw == true){
                     RegionCounts = UpdateRegionCounts(RegionCounts, BracketLayers, Seed, -1);
                  } else {
                     // If no redraw is needed, update the list of eligible seeds.
                     nUnseeded = nUnseeded - 1;
                     SeededRegions[Seed] = CurrentRegion;
                     SeededPlayers[Seed] = rPlayerIDs[j];
                     for (k = Draw; k < nUnseeded; k++){
                       RemainingSeeds[k] = RemainingSeeds[k + 1];
                     } // end for k
                  } // end if else
               } // end while bln_Redraw
            } // end for j
         } // end for i
      } // end if rPlayers
   } // end for r
   // ***** End random seed generation.  *****

   // Calculates the optimal number of pools and their size, given the user specified
   // minimum number of pools and maximum pool bracket size.
   n_pools = min_pools;
   PoolSize = Math.ceil(Math.pow(2, Math.ceil(Math.log2(n_players / n_pools))));

   if (max_pool_size != "NONE") {
      while (PoolSize > max_pools_size) {
         n_pools = Math.pow(2, Math.log2(n_pools) + 1);
         PoolSize = Math.ceil(Math.pow(2, Math.ceil(Math.log2(n_players / n_pools))));
      } // end while PoolSize
   }
   // If the final combination of pools creates a larger global bracket than necessary
   // the global BracketSize is increased accordingly.
   if (BracketSize < (n_pools * PoolSize)) {
      BracketSize = n_pools * PoolSize;
      BracketLayers = Math.log2(BracketSize);
   } // end if BracketSize

   // Building the seed numbers for the final global bracket size. The order matches
   // the OzHadou double elimination bracket layout, which should be consistent with
   // Challonge.
   SeedAddressGlobal = BuildBracketSeedValues(BracketSize);

   // Splitting the global seed addresses into pools.
   SeedAddressesByPool = Initialise2DArray(PoolSize, n_pools, 0);

   for (i = 0; i < n_pools; i++) {
      for (j = 0; j < PoolSize; j++) {
         m = PoolSize * i + (j + 1);
         SeedAddressesByPool[j][i] = SeedAddressGlobal[m - 1];
      } // end for j
      // Inverting the order where necessary so that the highest seeded player in each pool appears
      // at the top of the bracket for that pool. This is a display adjustment only.
      if (SeedAddressesByPool[0][i] > SeedAddressesByPool[PoolSize - 1][i]) {
         for (k = 0; k < (PoolSize / 2); k++) {
            int_temp = SeedAddressesByPool[k][i];
            SeedAddressesByPool[k][i] = SeedAddressesByPool[PoolSize - 1 - k][i];
            SeedAddressesByPool[PoolSize - k - 1][i] = int_temp;
         } //end for k
      } // end if SeedAddressesByPool
   } // end for i

   // Mapping seeded player IDs into the pool structure.
   SeedIDsPerPool = Initialise2DArray(PoolSize, n_pools, -1);

   for (i = 0; i < n_pools; i++) {
      for (j = 0; j < PoolSize; j++) {
         m = SeedAddressesByPool[j][i] - 1;
         if (m < n_players) {
            SeedIDsPerPool[j][i] = SeededPlayers[m];
         } // end if m
      } // end for j
   } // end for i

   // Setting background colours for each region.
   var colours = GenerateColourList(n_regions);
   var css = document.createElement('style');
   css.type = 'text/css';

   str_styles = "td.rgn"
   str_styles = str_styles.concat(0, "{background-color: ", ColourList(colours, 0), ";} ");

   for (i = 1; i < n_regions; i++) {
      str_styles = str_styles.concat("td.rgn", i, "{background-color: ", ColourList(colours, i), ";} ");
   } // end for i

   if (css.styleSheet) {
      css.styleSheet.cssText = str_styles;
   } else {
      css.appendChild(document.createTextNode(str_styles));
   } // end if else

   document.getElementsByTagName("head")[0].appendChild(css);

   // Displaying the seeding results along with diagnostics and output for pasting into Challonge.
   DisplayResults(n_regions, BracketSize, BracketLayers, n_players, SeededRegions, bln_region_seeding, RegionList, n_pools,
                  PoolSize, SeedIDsPerPool, PlayerRegionID, PlayerRegion, PlayerName, PlayerRank, MaxRank, bln_region_prefix,
                  id_RegionWarning, id_Output, id_Matchups, id_RegionCounts, id_SeedOrder, id_Alphabetical, id_ChallongeInfo,
                  id_ChallongeData, id_Challonge);

} // end function


// Displays the seeded players along with various diagnostics and output for pasting into Challonge.
function DisplayResults(n_regions, BracketSize, BracketLayers, n_players, SeededRegions, bln_region_seeding, RegionList, n_pools,
                        PoolSize, SeedIDsPerPool, PlayerRegionID, PlayerRegion, PlayerName, PlayerRank, MaxRank, bln_region_prefix,
                        id_RegionWarning, id_Output, id_Matchups, id_RegionCounts, id_SeedOrder, id_Alphabetical, id_ChallongeInfo,
                        id_ChallongeData, id_Challonge) {
   // ***** Declaring variables. *****
   // Arrays.
   var RegionCounts = [];
   var SeedAddressPool = [];
   var PoolRegionCounts = [];
   var AlphabeticalOrder = [];
   var PlayerPoolSeed = [];
   var PlayerRegionName = [];
   var AlphabeticalByPool = [];
   var AlphabeticalCurrentPool = [];
   // Strings.
   var RegionErrorList = "";
   var str_RegionErrors = "";
   var str_Matchups = "";
   var str_tr_class = "";
   var str_td_class = "";
   var str_RegionCounts = "";
   var str_SeedOrder = "";
   var str_Alphabetical = "";
   var str_ChallongeInfo = "";
   var str_ChallongeData = "";
   // Integers.
   var ExceptionCount = 0;
   var Row_Sums = 0;
   var Col_Sums = 0;
   var i = 0;
   var j = 0;
   var k = 0;
   var m = 0;
   var n = 0;
   // Booleans.
   // ***** End declaring variables. *****

   // Goes back through the entire bracket and checks the spread for each region.
   // Any region with a suboptimal spread will return an error message.
   for (i = 0; i < n_regions; i++){
      // Clear RegionCounts.
      RegionCounts = InitialiseArray(BracketSize, BracketLayers + 1, 0);

      // Find the counts for the current region for all bracket layers.
      for (j = 0; j < n_players; j++){
         if (SeededRegions[j] == i){
            RegionCounts = UpdateRegionCounts(RegionCounts, BracketLayers, j, 1);
         } // end if SeededRegions
      } // end for j

      // Count the exceptions.
      ExceptionCount = CountExceptions(RegionCounts, BracketLayers);
      // Disabling regoinal spread checks.
      if (bln_region_seeding == false){
         ExceptionCount = 0;
      } // end if bln_regional_seeding

      if (ExceptionCount > 0){
         if (RegionErrorList == ""){
            RegionErrorList = RegionList[i];
         } else {
            RegionErrorList = RegionErrorList.concat(", ", RegionList[i]);
         } // end if else
         str_RegionErrors = "<b>WARNING</b> - these regions are not perfectly spread: ";
         str_RegionErrors = str_RegionErrors.concat("<b>", RegionErrorList, "</b>.");
         str_RegionErrors = str_RegionErrors.concat("<br>Check the match-up data and re-seed if necessary.");
      }// end if ExceptionCount
   } // end for i

   // Displaying the match-ups.
   SeedAddressPool = BuildBracketSeedValues(PoolSize);
   PoolRegionCounts = Initialise2DArray(n_regions, n_pools, 0);
   // Table headers.
   str_Matchups = "<div class=\"bracket row\">";
   // Tables of players for each pool.
   for (i = 0; i < n_pools; i++) {
     var poolNumber = i + 1;
     var endClass = poolNumber == n_pools ? "end" : "";
      str_Matchups = str_Matchups.concat("<div class=\"medium-4 large-3 columns " + endClass + "\"><h5>Pool " + poolNumber + "</h5><table class=\"pool\">")
      for (j = 0; j < PoolSize; j++) {
         m  = SeedIDsPerPool[j][i];
         str_tr_class = "<tr class=\"match_bottom\">";
         if (m < 0) {
            str_td_class = "<td>";
         } else {
            str_td_class = "<td class=\"rgn";
            str_td_class = str_td_class.concat(PlayerRegionID[m], "\">");
         } //end if else

         if (j % 2 == 0){
            str_tr_class = "<tr class=\"match_top\">";
         } // end if j

         if (j == (PoolSize / 2) && PoolSize > 2){
            str_tr_class = "<tr class=\"half_top\">";
         } else {
            if ( (j == (PoolSize / 4) || j == 3 * (PoolSize / 4)) && PoolSize > 4){
               str_tr_class = "<tr class=\"quarter_top\">";
            } // end if j
         } // end if else

         str_Matchups = str_Matchups.concat(str_tr_class);

         str_Matchups = str_Matchups.concat(str_td_class, SeedAddressPool[j], "</td>", str_td_class);
         if (m < 0) {
            str_Matchups = str_Matchups.concat("</td><td>---</td><td>");
         } else {
            PoolRegionCounts[PlayerRegionID[m]][i] = PoolRegionCounts[PlayerRegionID[m]][i] + 1;
            str_Matchups = str_Matchups.concat("[", PlayerRegion[m], "]</td>", str_td_class, "<span title=\"" + PlayerName[m] + "\">", PlayerName[m], "</span></td>", str_td_class);
            if (PlayerRank[m] <= MaxRank) {
               str_Matchups = str_Matchups.concat("(", PlayerRank[m], ")");
            } // end if PlayerRank
         }// end if else
      str_Matchups = str_Matchups.concat("</td></tr>");
      } // end for j
   str_Matchups = str_Matchups.concat("</table></div>");
   } // end for i
   str_Matchups = str_Matchups.concat("</div>");

   Row_Sums = InitialiseArray(n_regions + 1, 1, 0);
   Col_Sums = InitialiseArray(n_pools, 1, 0);

   str_RegionCounts = "<div class=\"row\"><div class=\"medium-8 large-6 columns end\"><table class=\"region\"><thead><tr><th>Region</th>";
   for (i = 0; i < n_pools; i++) {
      str_RegionCounts = str_RegionCounts.concat("<th>Pool ", i + 1, "</th>");
   } // end for i
   str_RegionCounts = str_RegionCounts.concat("<th>Totals</th></tr></thead>");

   for (i = 0; i < n_regions; i++) {
      str_td_class = "<td class=\"rgn";
      str_td_class = str_td_class.concat(i, "\">");
      str_RegionCounts = str_RegionCounts.concat("<tr>", str_td_class, RegionList[i], "</td>");
      for (j = 0; j < n_pools; j++) {
         str_RegionCounts = str_RegionCounts.concat(str_td_class, PoolRegionCounts[i][j], "</td>");
         Row_Sums[i] = Row_Sums[i] + PoolRegionCounts[i][j];
         Col_Sums[j] = Col_Sums[j] + PoolRegionCounts[i][j];
      } //end for j
      str_RegionCounts = str_RegionCounts.concat(str_td_class, Row_Sums[i], "</td></tr>");
      Row_Sums[n_regions] = Row_Sums[n_regions] + Row_Sums[i];
   } // end for i

   str_RegionCounts = str_RegionCounts.concat("<tr><td><b>Totals</b></td>");
   for (j = 0; j < n_pools; j++) {
         str_RegionCounts = str_RegionCounts.concat("<td>", Col_Sums[j], "</td>");
      } //end for j
   str_RegionCounts = str_RegionCounts.concat("<td>", Row_Sums[n_regions], "</td></tr></table></div></div>");


   // Displaying players in pool seed order. Also stores player names (with region prefixes) for
   // alphabetical order sorting.
   n = Math.ceil(n_players / n_pools);
   AlphabeticalOrder = Initialise2DArray(n, n_pools, "---");

   PlayerPoolSeed = InitialiseArray(n_players, 1, 0);

   // Table headers.
   str_SeedOrder = "<div class=\"bracket row\">";
   // Tables of players for each pool.
   for (i = 0; i < n_pools; i++) {
     var poolNumber = i + 1;
     var endClass = poolNumber == n_pools ? "end" : "";
      str_SeedOrder = str_SeedOrder.concat("<div class=\"medium-4 large-3 columns " + endClass + "\"><h5>Pool " + poolNumber + "</h5><table class=\"pool\">")
      n = 0;
      for (j = 0; j < PoolSize; j++) {
         k = SeedAddressPool[j];
         m  = SeedIDsPerPool[k-1][i];

         if (m >= 0) {
            str_td_class = "<td class=\"rgn";
            str_td_class = str_td_class.concat(PlayerRegionID[m], "\">");
            str_SeedOrder = str_SeedOrder.concat("<tr>");
            // Storing pool seed for the current player for use in alphabetical order display.
            PlayerPoolSeed[m] = j + 1;
            str_SeedOrder = str_SeedOrder.concat(str_td_class, PlayerPoolSeed[m], "</td>", str_td_class);
            str_SeedOrder = str_SeedOrder.concat("[", PlayerRegion[m], "]</td>", str_td_class, "<span title=\"" + PlayerName[m] + "\">", PlayerName[m], "</span></td>", str_td_class);

            AlphabeticalOrder[j][i] = "[";
            AlphabeticalOrder[j][i] = AlphabeticalOrder[j][i].concat(PlayerRegion[m], "] ", PlayerName[m]);

            if (PlayerRank[m] <= MaxRank) {
               str_SeedOrder = str_SeedOrder.concat("(", PlayerRank[m], ")");
            } // end if PlayerRank
         str_SeedOrder = str_SeedOrder.concat("</td></tr>");
         n = n + 1;
         }// end if m
      } // end for j
   if (Math.ceil(n_players / n_pools) > n) {
      str_SeedOrder = str_SeedOrder.concat("<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>");
   } // end if
   str_SeedOrder = str_SeedOrder.concat("</table></div>");
   } // end for i
   str_SeedOrder = str_SeedOrder.concat("</div>");


   // Displaying players in alphabetical order (region name then player name).
   PlayerRegionName = InitialiseArray(n_players, 1, 0);

   for (i = 0; i < n_pools; i++) {
      for (j = 0; j < PoolSize; j++) {
         m = SeedIDsPerPool[j][i];
         if (m >= 0) {
            PlayerRegionName[m] = "[";
            PlayerRegionName[m] = PlayerRegionName[m].concat(PlayerRegion[m], "] ", PlayerName[m]);
         } // end if m
      } // end for j
   } // end for i

   AlphabeticalByPool = Initialise2DArray(n_pools, PoolSize, -1);

   for (i = 0; i < n_pools; i++) {
      AlphabeticalCurrentPool = InitialiseArray(AlphabeticalOrder.length, 1, "");
      for (j = 0; j < AlphabeticalCurrentPool.length; j++) {
         AlphabeticalCurrentPool[j] = AlphabeticalOrder[j][i];
      } // end for j
      AlphabeticalCurrentPool.sort(charOrdA);
      for (j = 0; j < AlphabeticalCurrentPool.length; j++) {
         AlphabeticalOrder[j][i] = AlphabeticalCurrentPool[j];
      } // end for j
   } // end for i

   // Table headers.
   str_Alphabetical = "<div class=\"bracket row\">";
   // Tables of players for each pool.
   for (i = 0; i < n_pools; i++) {
     var poolNumber = i + 1;
     var endClass = poolNumber == n_pools ? "end" : "";
      str_Alphabetical = str_Alphabetical.concat("<div class=\"medium-4 large-3 columns " + endClass + "\"><h5>Pool " + poolNumber + "</h5><table class=\"pool\">")
      n = 0;
      for (j = 0; j < AlphabeticalOrder.length; j++) {
         m  = PlayerRegionName.indexOf(AlphabeticalOrder[j][i]);

         if (m >= 0) {
            str_td_class = "<td class=\"rgn";
            str_td_class = str_td_class.concat(PlayerRegionID[m], "\">");
            str_Alphabetical = str_Alphabetical.concat("<tr>");

            str_Alphabetical = str_Alphabetical.concat(str_td_class, PlayerPoolSeed[m], "</td>", str_td_class);
            str_Alphabetical = str_Alphabetical.concat("[", PlayerRegion[m], "]</td>", str_td_class, "<span title=\"" + PlayerName[m] + "\">", PlayerName[m], "</span></td>", str_td_class);

            if (PlayerRank[m] <= MaxRank) {
               str_Alphabetical = str_Alphabetical.concat("(", PlayerRank[m], ")");
            } // end if PlayerRank
         str_Alphabetical = str_Alphabetical.concat("</td></tr>");
         } else {
            n = n + 1;
         }// end if else
      } // end for j
      for (j = 0; j < n; j++) {
         str_Alphabetical = str_Alphabetical.concat("<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>");
      } // end for j
      str_Alphabetical = str_Alphabetical.concat("</table></div>");
   } // end for i
   str_Alphabetical = str_Alphabetical.concat("</div>");


   // Providing directions for setting up pools in Challonge.
   if (n_pools > 1) {
      str_ChallongeInfo = "This tournament requires pools in Challonge.";
      str_ChallongeInfo = str_ChallongeInfo.concat("<ol><li>Go to the <b>Settings</b> page.</li>");
      str_ChallongeInfo = str_ChallongeInfo.concat("<li>Select <b>Two Stage Tournament</b>.</li>");
      str_ChallongeInfo = str_ChallongeInfo.concat("<li>Enter <b>", AlphabeticalOrder.length, "</b> for the number of participants per group.</li>");
      strChallonge_Info = str_ChallongeInfo.concat("<li>Enter <b>2</b> for the number of participants to advance from each group.</li>");
      str_ChallongeInfo = str_ChallongeInfo.concat("<li>Click <b>\"Add in Bulk\"</b> in your Challonge bracket then copy and paste the text bellow into Challonge.</li></ol>")
   } // end if n_pools

   // Building the list of players for Challonge.
   n = 0;
   for (i = 0; i < n_pools; i++) {
      for (j = 0; j < AlphabeticalOrder.length; j++) {
         k = SeedAddressPool[j];
         m  = SeedIDsPerPool[k-1][i];

         if (m >= 0) {
            if (bln_region_prefix == true) {
               str_ChallongeData = str_ChallongeData.concat("[", PlayerRegion[m], "] ");
            } // end if bln_region_prefix
            str_ChallongeData = str_ChallongeData.concat(PlayerName[m], "\n");
          } else {
            n = n + 1;
            str_ChallongeData = str_ChallongeData.concat("Bye_", n, "\n");
          } // end if else
      } // end for j
   } // end for i



   document.getElementById(id_RegionWarning).innerHTML = str_RegionErrors;

   document.getElementById(id_Matchups).innerHTML = str_Matchups;
   document.getElementById(id_RegionCounts).innerHTML = str_RegionCounts;
   document.getElementById(id_SeedOrder).innerHTML = str_SeedOrder;
   document.getElementById(id_Alphabetical).innerHTML = str_Alphabetical;

   document.getElementById(id_ChallongeInfo).innerHTML = str_ChallongeInfo;
   document.getElementById(id_ChallongeData).value = str_ChallongeData;

   OutputElement = document.getElementById(id_Output);
   OutputElement.style.display = "block";

   OutputElement = document.getElementById(id_Challonge);
   OutputElement.style.display = "block";

   scrollToElement(id_Output);

} // end function


// Initialises an array filled with "value".
// If ncols is 1 or less the array will be a vector.
function InitialiseArray(nrows, ncols, value) {
   // Declaring variables.
   var InitArray = [];
   var i = 0;
   var j = 0;

   // Uses Initialise2DArray if ncols > 1.
   if (ncols > 1) {
      InitArray = Initialise2DArray(nrows, ncols, value);
   } else {
     for(i = 0; i < nrows; i++){
        InitArray.push(value);
     } // end for i
   } // end if else

   return InitArray;
} // end function


// Initialises a 2D array filled with "value".
// Forces 2D array structure.
function Initialise2DArray(nrows, ncols, value) {
   // Declaring variables.
   var InitArray = [];
   var i = 0;
   var j = 0;

   for(i = 0; i < nrows; i++){
      InitArray.push([]);
   } // end for i


   for(i = 0; i < nrows; i++){
      for(j = 0; j < ncols; j++){
         InitArray[i].push(value);
      } // end for j
   } // end for i

   return InitArray;
} // end function


// Updates the regional counter array.
function UpdateRegionCounts(RegionCounts, BracketLayers, m, Increment) {
   // Updating the regional counter at the highest level.
   RegionCounts[m][BracketLayers] = RegionCounts[m][BracketLayers] + Increment;
   // Aggregating the regional counters back to the lowest level
   // i.e. to the grand total for the current region.
   for (k = (BracketLayers - 1); k >= 0; k--){
      if (m + 1 > Math.pow(2, k)){
         m = Math.pow(2, k + 1) - (m + 1);
      } // end if m
      RegionCounts[m][k] = RegionCounts[m][k] + Increment;
   } // end for k
   return RegionCounts;
} // end function


// Scans the regional counter array and returns a total count of exceptions for the regional spread.
function CountExceptions(RegionCounts, BracketLayers) {
   // Declaring variables.
   var ExceptionCount = 0;
   var k = 0;
   var m = 0;
   var n = 0;
   var absdiff = 0;

   for (k = 1; k <= BracketLayers; k++){
      for (m = 0; m < Math.pow(2,k); m++){
         for (n = m + 1; n < Math.pow(2,k); n++){
            absdiff = Math.abs(RegionCounts[m][k] - RegionCounts[n][k]);
            if (absdiff > 1){
               ExceptionCount = ExceptionCount + 1;
            } // end if absdiff
         } // end for n
      } // end for m
   } // end for k

   return ExceptionCount;
} // end function


// Builds a list of bracket seed numbers.The order matches the OzHadou double elimination bracket layout
// and should be consistent with Challonge.
function BuildBracketSeedValues(BracketSize) {
   // Declaring variables.
   var i = 0;
   var j = 0;
   var BracketLayers = Math.log2(BracketSize);
   // Establishing address arrays.
   SeedAddressTmp = InitialiseArray(BracketSize, 1, 0);
   SeedAddressGlobal = InitialiseArray(BracketSize, 1, 0);

   SeedAddressTmp[0] = 1;
   // Special case where there is only 1 player in the bracket.
   if (BracketLayers == 0) {
      SeedAddressGlobal[0] = 1;
   } // end if BracketLayers

   for (i = 1; i <= BracketLayers; i++) {
      for (j = 1; j <= Math.pow(2, i - 1); j++) {
         if (j % 2 == 0){
            SeedAddressGlobal[2 * j - 1] = SeedAddressTmp[j - 1];
            SeedAddressGlobal[2 * j - 2] = Math.pow(2, i) + 1 - SeedAddressGlobal[2 * j - 1];
         } else {
            SeedAddressGlobal[2 * j - 2] = SeedAddressTmp[j - 1];
            SeedAddressGlobal[2 * j - 1] = Math.pow(2, i) + 1 - SeedAddressGlobal[2 * j - 2];
         } // end if else
      } // next j
      for (j = 1; j <= Math.pow(2, i); j++) {
         SeedAddressTmp[j - 1] = SeedAddressGlobal[j - 1];
      } // next j
   } // next i

   return SeedAddressGlobal;

} // end function

function GenerateColourList(numColours) {
  var spectrum = 360;
  var offset = 200;
  var i = spectrum / numColours; // distribute the colors evenly on the hue range
  var colours = []; // hold the generated colors
  for (var x=0; x<numColours; x++)
  {
      var hue = offset + i * x;
      if (hue > spectrum) {
        hue -= spectrum;
      }
      //colours.push(hsvToRgb(hue, 25, 98));
      colours.push(hsvToRgb(hue, GetRandomNumber(2, 30), GetRandomNumber(92, 98)));
  }
  return colours;
}

function GetRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Builds a list of unique colours. Used to highlight players by region in the output tables.
function ColourList(Colours, i) {
  var colour = Colours[i];

   return "rgb("+colour[0]+","+colour[1]+","+colour[2]+")";
} // end function


// Used to enable case-insensitive string sorting for arrays.
// Ascending order.
function charOrdA(a, b){
   a = a.toLowerCase(); b = b.toLowerCase();
   if (a > b) return 1;
   if (a < b) return -1;
return 0;
} // end function

// Descending order.
function charOrdD(a, b) {
   a = a.toLowerCase(); b = b.toLowerCase();
   if (a < b) return 1;
   if (a > b) return -1;
   return 0;
} // end function


/**
 * HSV to RGB color conversion
 *
 * H runs from 0 to 360 degrees
 * S and V run from 0 to 100
 *
 * Ported from the excellent java algorithm by Eugene Vishnevsky at:
 * http://www.cs.rit.edu/~ncs/color/t_convert.html
 */
function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;

	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));

	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;

	if(s == 0) {
		// Achromatic (grey)
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));

	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;

		case 1:
			r = q;
			g = v;
			b = p;
			break;

		case 2:
			r = p;
			g = v;
			b = t;
			break;

		case 3:
			r = p;
			g = q;
			b = v;
			break;

		case 4:
			r = t;
			g = p;
			b = v;
			break;

		default: // case 5:
			r = v;
			g = p;
			b = q;
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function toggleOptions() {

  var optionsToggleText = "Hide options";
  var optionsActive = ($("#optionsToggle").attr("data-options-active") === "true");
  if (optionsActive) {
    optionsToggleText = "Show more options";
  }

  optionsActive = !optionsActive;
  $("#optionsToggle").attr("data-options-active", optionsActive);
  $("#optionsToggle").text(optionsToggleText);

  $("#options").slideToggle();
}

function scrollToElement(id) {
  $("html,body").animate({scrollTop:$("#"+id).offset().top - 112},"500");
}
