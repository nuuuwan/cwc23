import os
import webbrowser
from utils import Log, CSVFile, File

EXCEL_PATH = os.path.abspath(os.path.join('data', 'cwc2023.odds.xlsx'))
ODI_LIST_CSV_PATH = os.path.abspath(os.path.join('data', 'cwc2023.group_stage.odi_list.csv'))
ODI_LIST_JS_PATH = os.path.abspath(os.path.join('src', 'nonview','core','GROUP_STAGE_ODI_LIST.js'))

log = Log('main')

def generate_group_stage_odi_list():
    data_list = CSVFile(ODI_LIST_CSV_PATH).read()
    log.info(f'Read {len(data_list)} rows from {ODI_LIST_CSV_PATH}')

    lines = [
        'import ODI from "./ODI.js";',
'import { TEAM } from "./Team.js";',
'',
'export const GROUP_STAGE_ODI_LIST = [',
    ]


    for data in data_list:
        id = data['\ufeffid']
        date = data['date']
        team1 = data['team1-id']
        team2 = data['team2-id']
        venue = data['venue']
        winner = 'TEAM.' + data['winner'] if data['winner'] else 'null'
        odds1 = data['odds1'] if data['odds1'] else 'null' 
        odds2 = data['odds2'] if data['odds2'] else 'null'

        line = f'  new ODI("{id}", "{date}", TEAM.{team1}, TEAM.{team2}, "{venue}", {winner}, {odds1}, {odds2}),'
        lines.append(line)

    lines.append('];')

    File(ODI_LIST_JS_PATH).write_lines(lines)
    log.info(f'Write {len(lines)} lines to {ODI_LIST_JS_PATH}')

def open_files():
    os.startfile(EXCEL_PATH)
    for url in [
        'https://www.oddschecker.com/cricket',
        'https://www.oddschecker.com/cricket/world-cup/winner',
        'https://www.oddsportal.com/cricket/world/icc-world-cup/',
    ]:
        webbrowser.open(url)

if __name__ == '__main__':
    # open_files()
    generate_group_stage_odi_list()
