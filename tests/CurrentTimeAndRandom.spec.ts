import { toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { CurrentTimeAndRandom } from '../wrappers/CurrentTimeAndRandom';

describe('CurrentTimeAndRandom', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let currentTimeAndRandom: SandboxContract<CurrentTimeAndRandom>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        currentTimeAndRandom = blockchain.openContract(await CurrentTimeAndRandom.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await currentTimeAndRandom.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: currentTimeAndRandom.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and currentTimeAndRandom are ready to use
    });

    it.skip('should wait 10 sec', async () => {
        await currentTimeAndRandom.send(
            deployer.getSender(),
            {
                value: toNano('0.2'),
            },
            'wait 10s',
        );

        await sleep(10500); // 10,5 секунд ждать

        await currentTimeAndRandom.send(
            deployer.getSender(),
            {
                value: toNano('0.2'),
            },
            'wait 10s',
        );
    }, 20000);

    it('should show random', async () => {
        const randomInt = await currentTimeAndRandom.getRand();
        const randomBetween = await currentTimeAndRandom.getRandBetween(-10n, 30n);
        const unixTime = await currentTimeAndRandom.getUnixTime();
    });
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
