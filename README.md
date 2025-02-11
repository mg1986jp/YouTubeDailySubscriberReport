# YouTubeAPIを用いて指定の方法で通知するプログラム

## 作業流れ
* cloneする
* 必要な改修を行う
* git pushする（ローカル端末ではclasp pushはしない。秘匿情報が必要だから）

## デプロイの流れ
* git pushを検知する
* github actionが動く
* Secretsに設定している秘匿情報をgithub action仮想マシン内で参照し、config.gsを生成する
* clasp pushする

## 背景
github action仮想マシンを経由してGASにデプロイすることで、秘匿情報をgithubで一元管理できる。  
開発のしやすさでいうと、ローカル端末からclasp pushできる方が手軽感があるが、publicリポジトリの側面からこのようなアプローチとなる。  
そのため、`.clasp.json`もgit管理対象外なので、作業者がローカルからclasp pushできることは発生しない。  

## 秘匿情報

config.js
```config.js
const CLIENT_ID = 'GCPで取得したクライアントID';
const CLIENT_SECRET = 'GCPで取得したクライアントシークレット';
const REFRESH_TOKEN_KEY = 'YOUTUBE_REFRESH_TOKEN';
const CHANNEL_ID = 'YouTubeチャンネルID' 
const MAIL_TO = 'レポート送信先のメール';
```

雑に以下のような処理を仮想マシンで行う想定
```
echo "const CLIENT_ID = '${{ secrets.CLIENT_ID }}';" > src/config.gs
echo "const CLIENT_SECRET = '${{ secrets.CLIENT_SECRET }}';" >> src/config.gs
echo "const REFRESH_TOKEN_KEY = '${{ secrets.REFRESH_TOKEN_KEY }}';" >> src/config.gs
echo "const CHANNEL_ID = '${{ secrets.CHANNEL_ID }}';" >> src/config.gs
echo "const MAIL_TO = '${{ secrets.MAIL_TO }}';" >> src/config.gs
```

todo::
* 秘匿情報の設定
* github actionの設定、構築
