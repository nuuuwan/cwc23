import os

from utils import File, Log, Time

VERSION_JS = os.path.join('src', 'nonview', 'constants', 'VERSION.js')
log = Log('update_version')


def main():
    version_ut = Time.now().ut
    last_commit_message = 'Updated 📊Data'
    lines = [
        '// Auto-generated by javascript_version.py',
        f'export const VERSION_UT = {version_ut:.0f};',
        'export const VERSION_DATETIME = new Date(VERSION_UT * 1_000);',
        f'export const LAST_COMMIT_MESSAGE = "{last_commit_message}"',
    ]
    File(VERSION_JS).write_lines(lines)
    log.info(f'Wrote {VERSION_JS}')


if __name__ == '__main__':
    main()
