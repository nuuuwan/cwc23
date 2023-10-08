import os

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from utils import File, Log, Time, TimeFormat

from workflows.TEAM_NAME_TO_ID import TEAM_NAME_TO_ID

URL = 'https://www.oddschecker.com/cricket/world-cup/winner'
TEAM_ID_TO_P_WINNER_JS = os.path.join(
    'src', 'nonview', 'data', 'TEAM_ID_TO_P_WINNER.js'
)


log = Log('scrape_winner_odds')


def parse_fractional_odd(s: str) -> float:
    if '/' not in s:
        return float(s) + 1

    numerator, denominator = s.split('/')
    return (1.0 * int(numerator) / int(denominator)) + 1


def get_team_id_to_odds() -> dict[str, float]:
    log.debug('get_team_id_to_odds')
    options = Options()
    options.add_argument('-headless')
    driver = webdriver.Firefox(options=options)
    driver.get(URL)
    driver.implicitly_wait(10)

    try:
        table_body = driver.find_element(By.CLASS_NAME, 'eventTable')
    except Exception as e:
        log.error(e)
        driver.save_screenshot('screenshot.png')
        driver.quit()
        return {}       

    team_id_to_odds = {}
    for tr in table_body.find_elements(By.TAG_NAME, 'tr'):
        values = [td.text for td in tr.find_elements(By.TAG_NAME, 'td')]
        log.debug(str(values))
        team_name = values[0]
        if team_name not in TEAM_NAME_TO_ID:
            continue
        team_id = TEAM_NAME_TO_ID[team_name]

        odds_list = []
        for value in values[1:]:
            if value == '':
                continue
            odds = parse_fractional_odd(value)
            odds_list.append(odds)
        
        if len(odds_list) == 0:
            odds_avg = 10_000
        else:
            odds_avg = sum(odds_list) / len(odds_list)
        team_id_to_odds[team_id] = odds_avg
        log.debug(f'{team_id}: {odds_avg}')

    driver.quit()
    return team_id_to_odds


def get_team_id_to_p_winner(
    team_id_to_odds: dict[str, float]
) -> dict[str, float]:
    log.debug('get_team_id_to_p_winner')
    team_id_to_q = {}
    for team_id, odds in team_id_to_odds.items():
        team_id_to_q[team_id] = 1 / odds

    q_sum = sum(team_id_to_q.values())
    team_id_to_p_winner = {}
    for team_id, q in team_id_to_q.items():
        p = q / q_sum
        team_id_to_p_winner[team_id] = p
        log.debug(f'{team_id}: {p}')
    return team_id_to_p_winner


def write(team_id_to_p_winner: dict[str, float]):
    lines = []
    timestamp = TimeFormat('%Y-%m-%d %H:%M:%S').stringify(Time.now())
    lines.extend(
        [
            '// Auto Generated by workflows/scrape_winner_odds.py',
            f'// OC - {timestamp}',
        ]
    )
    lines.append('export const TEAM_ID_TO_P_WINNER = {')
    for team_id, p in team_id_to_p_winner.items():
        line = f'  {team_id}: {p:.6f}, // {p:.0%}'
        log.debug(line)
        lines.append(line)
    lines.append('};')
    File(TEAM_ID_TO_P_WINNER_JS).write_lines(lines)
    n_odds = len(team_id_to_p_winner.keys())
    log.info(f'Wrote {n_odds} probs to {TEAM_ID_TO_P_WINNER_JS}')


def main():
    team_id_to_odds = get_team_id_to_odds()
    if len(team_id_to_odds) == 10:
        team_id_to_p_winner = get_team_id_to_p_winner(team_id_to_odds)
        write(team_id_to_p_winner)


if __name__ == '__main__':
    main()
